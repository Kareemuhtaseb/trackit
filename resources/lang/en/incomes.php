<?php

return [
    'navigation' => [
        'index' => 'Incomes',
        'create' => 'Add Income',
    ],
    'titles' => [
        'index' => 'Incomes',
        'create' => 'Create Income',
        'edit' => 'Edit Income: :source',
        'show' => 'Income Details',
    ],
    'headings' => [
        'index' => 'Income Records',
        'create' => 'New Income',
        'edit' => 'Edit Income',
        'show' => 'Income Summary',
    ],
    'descriptions' => [
        'index' => 'Review, filter, and export your income entries.',
        'create' => 'Record a new income entry in your ledger.',
        'edit' => 'Update the details for :source.',
        'show' => 'Overview of the selected income entry.',
    ],
    'empty' => [
        'title' => 'No income records yet',
        'description' => 'Start tracking by creating your first income entry.',
    ],
    'fields' => [
        'source' => [
            'label' => 'Income Source',
            'placeholder' => 'Salary, freelance, etc.',
        ],
        'amount' => [
            'label' => 'Amount',
            'placeholder' => '0.00',
        ],
        'category' => [
            'label' => 'Category',
        ],
        'received_at' => [
            'label' => 'Received At',
        ],
    ],
    'filters' => [
        'search' => [
            'label' => 'Search',
            'placeholder' => 'Search income source...',
        ],
        'category' => 'Category',
        'type' => 'Type',
        'date_from' => 'From date',
        'date_to' => 'To date',
        'per_page' => 'Items per page',
        'apply' => 'Apply Filters',
        'reset' => 'Reset',
    ],
    'table' => [
        'source' => 'Source',
        'category' => 'Category',
        'amount' => 'Amount',
        'received_at' => 'Received',
        'actions' => 'Actions',
        'uncategorized' => 'Uncategorized',
    ],
    'actions' => [
        'save' => 'Save Income',
        'update' => 'Update Income',
        'cancel' => 'Cancel',
        'create' => 'New Income',
        'view' => 'View',
        'edit' => 'Edit',
        'delete' => 'Delete',
        'export' => 'Export',
        'back' => 'Back to Incomes',
    ],
    'types' => [
        'income' => 'Income',
        'expense' => 'Expense',
    ],
    'show' => [
        'source' => 'Source',
        'category' => 'Category',
        'amount' => 'Amount',
        'received_at' => 'Received At',
        'created_at' => 'Created At',
        'updated_at' => 'Last Updated',
    ],
    'messages' => [
        'confirm_delete' => 'Are you sure you want to delete this income?',
    ],
];
