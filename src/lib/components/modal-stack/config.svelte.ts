import { stack } from '@svelte-put/async-stack';
import ConfirmModal from '$lib/components/modal-stack/confirm-modal.svelte';
import CartDrawerModal from '$lib/components/modal-stack/cart-drawer-modal.svelte';
import ProductQuickViewModal from '$lib/components/modal-stack/product-quick-view-modal.svelte';

export const modalStack = stack()
	.addVariant('confirm', ConfirmModal)
	.addVariant('cartDrawer', CartDrawerModal)
	.addVariant('productQuickView', ProductQuickViewModal)
	.build();

export type ModalStack = typeof modalStack;
