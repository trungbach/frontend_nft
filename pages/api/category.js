import categoryService from '@/services/category'

export async function getListCategory() {
    const res = await categoryService.getListCategory();
    return res.body.data;
}

export async function getCategoryBySlug(payload) {
    const res = await categoryService.getCategoryBySlug(payload);
    return res.body;
}
