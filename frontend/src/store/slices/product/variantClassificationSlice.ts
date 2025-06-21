import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ObjectId } from "bson";
import { classificationApi } from "@/lib/api/classification";
import slugify from "slugify";
import { Classification } from "@/types/productType";


export interface SelectOption {
  label: string;
  value: string;
  _id: string;
  __isNew__?: boolean;
}

// Định nghĩa trạng thái
interface VariantClassificationsState {
  classifications: Classification[];
  classificationOptions: SelectOption[];
  optionRecommendations: Record<string, SelectOption[]>;
  isLoadingClassifications: boolean;
  isLoadingOptions: Record<string, boolean>;
  error: string | null;
}

// Trạng thái ban đầu
const initialState: VariantClassificationsState = {
  classifications: [
  ],
  classificationOptions: [],
  optionRecommendations: {},
  isLoadingClassifications: false,
  isLoadingOptions: {},
  error: null,
};

// Async thunk để fetch classification recommendations
export const fetchClassificationRecommendations = createAsyncThunk(
  "variantClassifications/fetchClassificationRecommendations",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const recommendations = await classificationApi.fetchClassificationRecommendations(projectId);
      return recommendations.map((rec: any) => ({
        label: rec.label,
        value: rec.value,
        _id: rec._id,
      }));
    } catch (error) {
      console.error("Error fetching classification recommendations:", error);
      return rejectWithValue("Không thể tải gợi ý phân loại. Vui lòng thử lại sau.");
    }
  }
);

// Async thunk để fetch option recommendations
export const fetchOptionRecommendations = createAsyncThunk(
  "variantClassifications/fetchOptionRecommendations",
  async ({ classIndex, classificationId }: { classIndex: number; classificationId: string }, { rejectWithValue }) => {
    try {
      const recommendations = await classificationApi.fetchClassificationValueRecommendations(classificationId);
      return {
        classIndex,
        options: recommendations.map((rec: any) => ({
          label: rec.label,
          value: rec.value,
          _id: rec._id,
        })),
      };
    } catch (error) {
      console.error(`Error fetching option recommendations for classification ${classificationId}:`, error);
      return rejectWithValue(`Không thể tải gợi ý tùy chọn. Vui lòng thử lại sau.`);
    }
  }
);

// Slice
const variantClassificationsSlice = createSlice({
  name: "variantClassifications",
  initialState,
  reducers: {
        resetClassification: () => {
          return initialState
        },
    
    // Cập nhật classifications và gọi updateClassifications
    updateClassificationsState: (state, action: PayloadAction<Classification[]>) => {
      state.classifications = action.payload;
    },

    // Xử lý khi chọn classification
    handleClassificationSelect: (
      state,
      action: PayloadAction<{ classIndex: number; selectedOption: SelectOption | null }>
    ) => {
      const { classIndex, selectedOption } = action.payload;
      const newClassifications = [...state.classifications];
    
      if (!selectedOption) {
        newClassifications[classIndex] = {
          ...newClassifications[classIndex],
          label: "",
          value: "",
          name: "",
          options: [
            {
              _id: new ObjectId().toString(),
              label: "",
              value: "",
              isCustom: false,
            },
          ],
        };
        state.classifications = newClassifications;
        delete state.optionRecommendations[classIndex];
        return;
      }
    
    
      const isDuplicate = state.classifications.some(
        (classification, i) => i !== classIndex && classification.value === selectedOption.value
      );
    
      if (isDuplicate) {
        state.error = `Phân loại "${selectedOption.label}" đã được chọn. Vui lòng chọn giá trị khác.`;
        return;
      }
    
      state.error = null;
      const isCustom = selectedOption.__isNew__ === true;
    
      newClassifications[classIndex] = {
        ...newClassifications[classIndex],
        _id: selectedOption._id || new ObjectId().toString(),
        label: selectedOption.label,
        value: selectedOption.value,
        name: selectedOption.label,
        options: newClassifications[classIndex].options || [
          {
            _id: new ObjectId().toString(),
            label: "",
            value: "",
            isCustom: false,
          },
        ],
      };
    
      state.classifications = newClassifications;
    },

    // Xử lý khi chọn option
    handleOptionSelect: (
      state,
      action: PayloadAction<{
        classIndex: number;
        optionIndex: number;
        selectedOption: SelectOption | null;
      }>
    ) => {
      const { classIndex, optionIndex, selectedOption } = action.payload;
      const newClassifications = [...state.classifications];
    
      if (!selectedOption) {
        newClassifications[classIndex].options[optionIndex] = {
          ...newClassifications[classIndex].options[optionIndex],
          label: "",
          value: "",
          isCustom: false,
        };
        state.classifications = newClassifications;
        return;
      }
    
    
      const isDuplicate = newClassifications[classIndex].options.some(
        (option, i) => i !== optionIndex && option.value === selectedOption.value
      );
    
      if (isDuplicate) {
        state.error = `Tùy chọn "${selectedOption.label}" đã được chọn trong phân loại này. Vui lòng chọn giá trị khác.`;
        return;
      }
    
      state.error = null;
      const isCustom = selectedOption.__isNew__ === true;
    
      newClassifications[classIndex].options[optionIndex] = {
        ...newClassifications[classIndex].options[optionIndex],
        _id: selectedOption._id || new ObjectId().toString(),
        label: selectedOption.label,
        value: selectedOption.value,
        isCustom: isCustom,
      };
    
      state.classifications = newClassifications;
    },
    // Thêm một tùy chọn mới
    addOption: (state, action: PayloadAction<number>) => {
      const classIndex = action.payload;
      const newClassifications = [...state.classifications];

      newClassifications[classIndex].options.push({
        _id: new ObjectId().toString(),
        label: "",
        value: "",
        isCustom: false,
      });

      state.classifications = newClassifications;
    },

    // Xóa một tùy chọn
    removeOption: (state, action: PayloadAction<{ classIndex: number; optionIndex: number }>) => {
      const { classIndex, optionIndex } = action.payload;
      const newClassifications = [...state.classifications];
      const classification = newClassifications[classIndex];

      if (classification.options.length <= 1) return;

      classification.options.splice(optionIndex, 1);
      state.classifications = newClassifications;
    },

    // Thêm một phân loại mới
    addClassification: (state) => {
      const newClassification: Classification = {
        _id: new ObjectId().toString(),
        label: "",
        value: "",
        name: "",
        isCustom:false,
        options: [
          {
            _id: new ObjectId().toString(),
            label: "",
            value: "",
            isCustom: false,
          },
        ],
      };

      state.classifications = [...state.classifications, newClassification];
    },

    // Xóa một phân loại
    removeClassification: (state, action: PayloadAction<number>) => {
      const classIndex = action.payload;
      const newClassifications = [...state.classifications];
      newClassifications.splice(classIndex, 1);
      state.classifications = newClassifications;
      delete state.optionRecommendations[classIndex];
    },
    // Xóa lỗi
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch classification recommendations
      .addCase(fetchClassificationRecommendations.pending, (state) => {
        state.isLoadingClassifications = true;
        state.error = null;
      })
      .addCase(fetchClassificationRecommendations.fulfilled, (state, action: PayloadAction<SelectOption[]>) => {
        state.isLoadingClassifications = false;
        state.classificationOptions = action.payload;
        if (action.payload.length === 0) {
          state.error = "Không có gợi ý phân loại nào.";
        }
      })
      .addCase(fetchClassificationRecommendations.rejected, (state, action) => {
        state.isLoadingClassifications = false;
        state.error = action.payload as string;
      })

      // Fetch option recommendations
      .addCase(fetchOptionRecommendations.pending, (state, action) => {
        const { classIndex } = action.meta.arg;
        state.isLoadingOptions[classIndex] = true;
        state.error = null;
      })
      .addCase(fetchOptionRecommendations.fulfilled, (state, action) => {
        const { classIndex, options } = action.payload;
        state.isLoadingOptions[classIndex] = false;
        state.optionRecommendations[classIndex] = options;
      })
      .addCase(fetchOptionRecommendations.rejected, (state, action) => {
        const { classIndex } = action.meta.arg;
        state.isLoadingOptions[classIndex] = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateClassificationsState,
  handleClassificationSelect,
  handleOptionSelect,
  resetClassification,
  addOption,
  removeOption,
  addClassification,
  removeClassification,
  clearError,
} = variantClassificationsSlice.actions;

export default variantClassificationsSlice.reducer;