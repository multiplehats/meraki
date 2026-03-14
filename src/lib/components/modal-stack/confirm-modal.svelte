<script lang="ts">
	import type { StackItemProps } from '@svelte-put/async-stack';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	type ConfirmModalResult = { confirmed: boolean };

	type Props = StackItemProps<ConfirmModalResult> & {
		title: string;
		description: string;
		details?: string;
		confirmLabel?: string;
		variant?: 'default' | 'destructive';
	};

	let {
		item,
		title,
		description,
		details,
		confirmLabel = 'Delete',
		variant = 'destructive'
	}: Props = $props();

	function handleConfirm() {
		item.resolve({ confirmed: true });
	}

	function handleOpenChange(open: boolean) {
		if (!open) {
			item.resolve({ confirmed: false });
		}
	}
</script>

<AlertDialog.Root open={true} onOpenChange={handleOpenChange}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{title}</AlertDialog.Title>
			<AlertDialog.Description>{description}</AlertDialog.Description>
			{#if details}
				<div
					class="mt-3 rounded-md border bg-muted/50 px-3 py-2.5 text-left text-xs text-muted-foreground"
				>
					{details}
				</div>
			{/if}
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action class={buttonVariants({ variant })} onclick={handleConfirm}>
				{confirmLabel}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
