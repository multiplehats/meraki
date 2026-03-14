import type { CartItem } from './types';

function createCartStore() {
	let items = $state<CartItem[]>([]);

	if (typeof window !== 'undefined') {
		try {
			const stored = localStorage.getItem('meraki_cart');
			if (stored) items = JSON.parse(stored) as CartItem[];
		} catch {
			// corrupt data — start fresh
		}
	}

	function persist() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('meraki_cart', JSON.stringify(items));
		}
	}

	return {
		get items() {
			return items;
		},
		get itemCount() {
			return items.reduce((sum, i) => sum + i.qty, 0);
		},
		get subtotal() {
			return items.reduce((sum, i) => sum + i.price * i.qty, 0);
		},

		addItem(newItem: CartItem) {
			const existing = items.find((i) => i.productId === newItem.productId);
			if (existing) {
				items = items.map((i) =>
					i.productId === newItem.productId ? { ...i, qty: i.qty + newItem.qty } : i
				);
			} else {
				items = [...items, newItem];
			}
			persist();
		},

		removeItem(productId: string) {
			items = items.filter((i) => i.productId !== productId);
			persist();
		},

		updateQty(productId: string, qty: number) {
			if (qty <= 0) {
				items = items.filter((i) => i.productId !== productId);
			} else {
				items = items.map((i) => (i.productId === productId ? { ...i, qty } : i));
			}
			persist();
		},

		clearCart() {
			items = [];
			persist();
		}
	};
}

export const cart = createCartStore();
