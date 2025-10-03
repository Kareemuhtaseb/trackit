<?php

return [
    'navigation' => [
        'index' => 'Transactions',
        'create' => 'Add Transaction',
    ],
    'titles' => [
        'index' => 'Transactions',
        'create' => 'Create Transaction',
        'edit' => 'Edit Transaction: :description',
        'show' => 'Transaction Details',
    ],
    'headings' => [
        'index' => 'Transaction History',
        'create' => 'New Transaction',
        'edit' => 'Edit Transaction',
        'show' => 'Transaction Summary',
    ],
    'descriptions' => [
        'index' => 'Monitor cash flow with a detailed transaction log.',
        'create' => 'Log income or expense transactions for better tracking.',
        'edit' => 'Modify the details for :description.',
        'show' => 'Overview of the selected transaction.',
    ],
    'empty' => [
        'title' => 'No transactions recorded',
        'description' => 'Add your first transaction to start tracking.',
    ],
    'fields' => [
        'description' => [
            'label' => 'Description',
            'placeholder' => 'e.g. Coffee with client',
        ],
        'amount' => [
            'label' => 'Amount',
            'placeholder' => '0.00',
        ],
        'category' => [
            'label' => 'Category',
        ],
        'type' => [
            'label' => 'Type',
        ],
        'transaction_date' => [
            'label' => 'Transaction Date',
        ],
    ],
    'filters' => [
        'search' => [
            'label' => 'Search',
            'placeholder' => 'Search description...',
        ],
        'category' => 'Category',
        'type' => 'Type',
        'date_from' => 'From date',
        'date_to' => 'To date',
        'per_page' => 'Items per page',
        'apply' => 'Apply Filters',
        'reset' => 'Reset',
    ],
    'types' => [
        'debit' => 'Debit',
        'credit' => 'Credit',
    ],
    'table' => [
        'description' => 'Description',
        'category' => 'Category',
        'type' => 'Type',
        'amount' => 'Amount',
        'transaction_date' => 'Date',
        'actions' => 'Actions',
        'uncategorized' => 'Uncategorized',
    ],
    'actions' => [
        'save' => 'Save Transaction',
        'update' => 'Update Transaction',
        'cancel' => 'Cancel',
        'create' => 'New Transaction',
        'view' => 'View',
        'edit' => 'Edit',
        'delete' => 'Delete',
        'export' => 'Export',
        'back' => 'Back to Transactions',
    ],
    'show' => [
        'description' => 'Description',
        'category' => 'Category',
        'type' => 'Type',
        'amount' => 'Amount',
        'transaction_date' => 'Transaction Date',
        'created_at' => 'Created At',
        'updated_at' => 'Last Updated',
    ],
    'messages' => [
        'confirm_delete' => 'Are you sure you want to delete this transaction?',
    ],
];
