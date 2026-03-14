import { stack } from '@svelte-put/async-stack';
import ConfirmModal from '$lib/components/modal-stack/confirm/confirm-modal.svelte';
import CartDrawerModal from '$lib/components/modal-stack/cart-drawer/cart-drawer-modal.svelte';

export const modalStack = stack()
	.addVariant('confirm', ConfirmModal)
	.addVariant('cartDrawer', CartDrawerModal)
	.build();

export type ModalStack = typeof modalStack;
