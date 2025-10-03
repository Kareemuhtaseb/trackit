<?php

return [
    'income' => [
        'filename' => 'exports.income.filename',
        'headers' => [
            'exports.income.columns.source',
            'exports.income.columns.amount',
            'exports.income.columns.category',
            'exports.income.columns.received_at',
            'exports.income.columns.created_at',
        ],
    ],
    'transaction' => [
        'filename' => 'exports.transaction.filename',
        'headers' => [
            'exports.transaction.columns.description',
            'exports.transaction.columns.amount',
            'exports.transaction.columns.type',
            'exports.transaction.columns.category',
            'exports.transaction.columns.transaction_date',
            'exports.transaction.columns.created_at',
        ],
    ],
    'date_format' => 'Y-m-d',
    'datetime_format' => 'Y-m-d H:i:s',
];