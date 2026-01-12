import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
  selectedProductId: string | null;
}

const initialState: ProductState = {
  selectedProductId: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProductId: (state, action: PayloadAction<string>) => {
      state.selectedProductId = action.payload;
    },
  },
});

export const { setProductId } = productSlice.actions;
export default productSlice.reducer;
