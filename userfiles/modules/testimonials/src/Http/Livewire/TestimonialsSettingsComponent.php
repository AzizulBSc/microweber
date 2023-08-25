<?php
namespace MicroweberPackages\Modules\Testimonials\Http\Livewire;

use MicroweberPackages\LiveEdit\Http\Livewire\ModuleSettingsComponent;

class TestimonialsSettingsComponent extends ModuleSettingsComponent
{
    public $editorSettings = [];

    public function render()
    {
        $this->editorSettings = $this->getEditorSettings();

       return view('microweber-module-testimonials::livewire.settings');
    }


    public function getEditorSettings()
    {

        $editorSettings = [
            'config' => [
                'title' => '',
                'addButtonText' => 'Add Testimonial',
                'editButtonText' => 'Edit',
                'deleteButtonText' => 'Delete',
                'sortItems' => true,
                'settingsKey' => 'settings',
                'listColumns' => [
                    'name' => 'name',
                ],
            ],
            'schema' => [
                [
                    'type' => 'text',
                    'rules' => 'required|min:2|max:255',
                    'label' => 'Name',
                    'name' => 'name',
                    'placeholder' => 'Name',
                    'help' => 'Name is required'
                ],
                [
                  'type' => 'textarea',
                    'rules' => 'required|min:2|max:255',
                    'label' => 'Content',
                    'name' => 'content',
                    'placeholder' => 'Content',
                    'help' => 'Content is required'
                ],
                [
                    'type' => 'text',
                    'rules' => 'required|min:2|max:255',
                    'label' => 'Read more URL',
                    'name' => 'read_more_url',
                    'placeholder' => 'Read more URL',
                    'help' => 'Read more URL is required'
                ],
                [
                    'type' => 'text',
                    'rules' => 'required|min:2|max:255',
                    'label' => 'Created on',
                    'name' => 'created_on',
                    'placeholder' => 'Created on',
                    'help' => 'Created on is required'
                ],
                [
                    'type'=>'text',
                    'rules'=>'required|min:2|max:255',
                    'label'=>'Project name',
                    'name'=>'project_name',
                    'placeholder'=>'Project name',
                    'help'=>'Project name is required'
                ],
                [
                    'type'=>'text',
                    'rules'=>'required|min:2|max:255',
                    'label'=>'Client company',
                    'name'=>'client_company',
                    'placeholder'=>'Client company',
                    'help'=>'Client company is required'
                ],
                [
                    'type'=>'text',
                    'rules'=>'required|min:2|max:255',
                    'label'=>'Client role',
                    'name'=>'client_role',
                    'placeholder'=>'Client role',
                    'help'=>'Client role is required'
                ],
                [
                    'type'=>'image',
                    'rules'=>'required|min:2|max:255',
                    'label'=>'Client picture',
                    'name'=>'client_picture',
                    'placeholder'=>'Client picture',
                    'help'=>'Client picture is required'
                ],
                [
                    'type'=>'text',
                    'rules'=>'required|min:2|max:255',
                    'label'=>'Client website',
                    'name'=>'client_website',
                    'placeholder'=>'Client website',
                    'help'=>'Client website is required'
                ]
            ]
        ];
        return $editorSettings;
    }

}
