from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from events.models import Category

User = get_user_model()

class UserRegisterTests(APITestCase):
    def setUp(self):
        self.url = reverse('user-register')

    def test_register_success(self):
        payload = {
            'email': 'john@example.com',
            'password': 'ComplexP@ssw0rd',
            'password2': 'ComplexP@ssw0rd',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], payload['email'])
        self.assertTrue(User.objects.filter(email=payload['email']).exists())

    def test_register_password_mismatch(self):
        payload = {
            'email': 'jane@example.com',
            'password': 'ComplexP@ssw0rd',
            'password2': 'DifferentP@ssw0rd',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('non_field_errors', response.data)

    def test_register_missing_fields(self):
        payload = {
            'password': 'ComplexP@ssw0rd',
            'password2': 'ComplexP@ssw0rd',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_invalid_password(self):
        payload = {
            'email': 'bob@example.com',
            'password': '123',
            'password2': '123',
        }
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)


class TokenAuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('user-register')
        self.token_url = reverse('token_obtain')
        self.refresh_url = reverse('token_refresh')
        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'ComplexP@ssw0rd',
            'password2': 'ComplexP@ssw0rd',
        }
        self.client.post(self.register_url, self.user_data, format='json')

    def test_obtain_token_success(self):
        login_data = {
            'email': self.user_data['email'],
            'password': self.user_data['password'],
        }
        response = self.client.post(self.token_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.refresh_token = response.data['refresh']

    def test_obtain_token_fail(self):
        bad_data = {
            'email': self.user_data['email'],
            'password': 'WrongPassword',
        }
        response = self.client.post(self.token_url, bad_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_refresh_token_success(self):
        resp = self.client.post(self.token_url, {'email': self.user_data['email'], 'password': self.user_data['password']}, format='json')
        refresh = resp.data.get('refresh')
        response = self.client.post(self.refresh_url, {'refresh': refresh}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_refresh_token_fail(self):
        response = self.client.post(self.refresh_url, {'refresh': 'invalidtoken'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)


class UserProfileTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('user-register')
        self.token_url = reverse('token_obtain')
        self.profile_url = reverse('user-profile')

        self.user_data = {
            'email': 'testuser@example.com',
            'password': 'ComplexP@ssw0rd',
            'password2': 'ComplexP@ssw0rd',
        }
        resp = self.client.post(self.register_url, self.user_data, format='json')
        assert resp.status_code == status.HTTP_201_CREATED

        login = {
            'email': self.user_data['email'],
            'password': self.user_data['password'],
        }
        token_resp = self.client.post(self.token_url, login, format='json')
        assert token_resp.status_code == status.HTTP_200_OK
        self.access = token_resp.data['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access}')

    def test_get_profile_success(self):
        resp = self.client.get(self.profile_url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('preferred_categories', resp.data)
        self.assertEqual(resp.data['preferred_categories'], [])

    def test_update_profile_success(self):
        cat1 = Category.objects.get(name='Cat 1')
        cat2 = Category.objects.get(name='Cat 2')

        payload = {'preferred_categories': [cat1.id, cat2.id]}
        resp = self.client.put(self.profile_url, payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        returned = sorted(resp.data['preferred_categories'])
        expected = sorted([cat1.id, cat2.id])
        self.assertEqual(returned, expected)

        profile = User.objects.get(email=self.user_data['email']).profile
        db_ids = list(profile.preferred_categories.order_by('id').values_list('id', flat=True))
        self.assertEqual(db_ids, expected)

    def test_unauthenticated_access_forbidden(self):
        self.client.credentials()
        get_resp = self.client.get(self.profile_url)
        put_resp = self.client.put(self.profile_url, {'preferred_categories': []}, format='json')
        self.assertEqual(get_resp.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(put_resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_with_invalid_category(self):
        payload = {'preferred_categories': [9999]}
        resp = self.client.put(self.profile_url, payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('preferred_categories', resp.data)