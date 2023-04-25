<div class="mx-5 my-5">
    <x-microweber-ui::form-section submit="updatePassword">
        <x-slot name="title">
            Update Password
        </x-slot>

        <x-slot name="description">
            Ensure your account is using a long, random password to stay secure.
        </x-slot>

        <x-slot name="form">

            <div class="col-span-6 sm:col-span-4">
                <x-microweber-ui::label for="password" value="Password" />
                <x-microweber-ui::input id="password" type="password" class="mt-1 block w-full" wire:model.defer="state.password" autocomplete="password" />
                <x-microweber-ui::input-error for="password" class="mt-2" />
            </div>

        </x-slot>

        <x-slot name="actions">
            <x-microweber-ui::action-message class="mr-3" on="saved">
                Saved.
            </x-microweber-ui::action-message>

            <x-microweber-ui::button>
                Save
            </x-microweber-ui::button>
        </x-slot>
    </x-microweber-ui::form-section>
</div>
