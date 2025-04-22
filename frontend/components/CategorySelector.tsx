import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Chip } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface Props {
  allCats: any[];
  selectedCats: any[];
  setSelectedCats: (cats: any[]) => void;
}

export default function CategorySelector({
  allCats,
  selectedCats,
  setSelectedCats,
}: Props) {
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={allCats}
      getOptionLabel={(opt) => opt.name}
      value={selectedCats}
      onChange={(_, value) => setSelectedCats(value)}
      limitTags={3}
      disableClearable
      popupIcon={<KeyboardArrowDownIcon />}
      renderTags={(value, getTagProps) =>
        value.map((option, idx) => {
          const { key, ...chipProps } = getTagProps({ index: idx });
          return (
            <Chip
              key={key}
              size="small"
              variant="outlined"
              label={option.name}
              {...chipProps}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Categories"
          placeholder="Select…"
          size="small"
          variant="outlined"
        />
      )}
      sx={{ mb: 2 }}
    />
  );
}
