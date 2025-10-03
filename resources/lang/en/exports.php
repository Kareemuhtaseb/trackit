<?php

return [
    'income' => [
        'filename' => 'incomes',
        'columns' => [
            'source' => 'Source',
            'amount' => 'Amount',
            'category' => 'Category',
            'received_at' => 'Received At',
            'created_at' => 'Created At',
        ],
    ],
    'transaction' => [
        'filename' => 'transactions',
        'columns' => [
            'description' => 'Description',
            'amount' => 'Amount',
            'type' => 'Type',
            'category' => 'Category',
            'transaction_date' => 'Transaction Date',
            'created_at' => 'Created At',
        ],
    ],
];