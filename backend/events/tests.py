from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta

from rest_framework.test import APIClient

from django.contrib.auth import get_user_model

from .models import Category, TimeSlot, Booking

User = get_user_model()


class TimeSlotAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.cat1 = Category.objects.get(name='Cat 1')
        self.cat2 = Category.objects.get(name='Cat 2')
        now = timezone.now()
        self.slot1 = TimeSlot.objects.create(
            category=self.cat1,
            start=now,
            end=now + timedelta(hours=1)
        )
        self.slot2 = TimeSlot.objects.create(
            category=self.cat2,
            start=now + timedelta(hours=2),
            end=now + timedelta(hours=3)
        )
        self.user = User.objects.create_user(
            first_name='user',
            last_name='user',
            email='user@example.com',
            password='verysecretpassword'
        )
        Booking.objects.create(user=self.user, slot=self.slot2)
        self.url = reverse('available-timeslots')

    def test_unauthenticated_cannot_fetch_timeslots(self):
        resp = self.client.get(self.url, {'categories': f'{self.cat1.id},{self.cat2.id}'})
        self.assertEqual(resp.status_code, 401)

    def test_get_all_slots_with_is_taken_flag(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get(self.url, {'categories': f'{self.cat1.id},{self.cat2.id}'})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(len(data), 2)
        by_id = {item['id']: item for item in data}
        self.assertIn(self.slot1.id, by_id)
        self.assertFalse(by_id[self.slot1.id]['is_taken'])
        self.assertIn(self.slot2.id, by_id)
        self.assertTrue(by_id[self.slot2.id]['is_taken'])

    def test_filtering_by_single_category(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get(self.url, {'categories': str(self.cat1.id)})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['id'], self.slot1.id)
        self.assertFalse(data[0]['is_taken'])

    def test_empty_or_missing_categories_param(self):
        self.client.force_authenticate(user=self.user)
        resp1 = self.client.get(self.url)
        self.assertEqual(resp1.status_code, 200)
        self.assertEqual(resp1.json(), [])
        resp2 = self.client.get(self.url, {'categories': ''})
        self.assertEqual(resp2.status_code, 200)
        self.assertEqual(resp2.json(), [])

    def test_invalid_category_ids_returns_400(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get(self.url, {'categories': 'foo,bar'})
        self.assertEqual(resp.status_code, 400)
        self.assertIn('detail', resp.json())


class CategoryAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.cat1 = Category.objects.get(name='Cat 1')
        self.cat2 = Category.objects.get(name='Cat 2')
        self.cat3 = Category.objects.get(name='Cat 3')
        self.user = User.objects.create_user(
            first_name='user',
            last_name='user',
            email='user@example.com',
            password='verysecretpassword'
        )
        self.url = reverse('category-list')

    def test_unauthenticated_cannot_fetch_categories(self):
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, 401)

    def test_authenticated_can_fetch_categories(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get(self.url)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(len(data), 3)
        ids = [item['id'] for item in data]
        self.assertCountEqual(ids, [self.cat1.id, self.cat2.id, self.cat3.id])
