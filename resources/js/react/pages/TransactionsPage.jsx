import { useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";

import { ArrowUpDown, FileDown, Filter, SlidersHorizontal, Upload, X } from "lucide-react";
import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import SearchInput from "../components/ui/SearchInput.jsx";
import sampleTransactions from "../data/sampleTransactions.js";
import { cn } from "../utils/cn.js";

const statusVariantMap = {
    cleared: "success",
    pending: "warning",
    failed: "danger",
};

const defaultFilters = {
    search: "",
    type: "all",
    status: "all",
    category: "all",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
};

const inputBaseClasses =
    "mt-1 w-full rounded-lg border border-neutral-200/70 bg-surface-muted px-3 py-2 text-sm font-medium text-neutral-600 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-neutral-800 dark:bg-surface-dark-muted dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-primary-500 dark:focus:ring-primary-500/30";

const toNumberOrNull = (value) => {
    if (value === null || value === undefined || value === "") {
        return null;
    }
    const number = Number.parseFloat(String(value));
    return Number.isNaN(number) ? null : number;
};

const parseAmount = (value) => {
    if (value === null || value === undefined || value === "") {
        return null;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    const sanitized = String(value)
        .trim()
        .replace(/[^0-9.,-]/g, "")
        .replace(/,/g, "");
    if (!sanitized) {
        return null;
    }
    const amount = Number.parseFloat(sanitized);
    return Number.isNaN(amount) ? null : amount;
};

const normalizeType = (value, amount) => {
    const normalized = (value ?? "")
        .toString()
        .trim()
        .toLowerCase();
    if (["credit", "income", "inflow"].includes(normalized)) {
        return "credit";
    }
    if (["debit", "expense", "outflow"].includes(normalized)) {
        return "debit";
    }
    if (typeof amount === "number") {
        return amount >= 0 ? "credit" : "debit";
    }
    return "debit";
};

const normalizeStatus = (value) => {
    const normalized = (value ?? "")
        .toString()
        .trim()
        .toLowerCase();
    if (["cleared", "posted", "completed", "settled"].includes(normalized)) {
        return "cleared";
    }
    if (["pending", "processing", "scheduled"].includes(normalized)) {
        return "pending";
    }
    if (["failed", "declined", "error"].includes(normalized)) {
        return "failed";
    }
    return "pending";
};

const normalizeDate = (value) => {
    if (!value) {
        return null;
    }
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return trimmed;
    }
    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const splitCsvLine = (line) => {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        if (char === "\"") {
            const nextChar = line[index + 1];
            if (inQuotes && nextChar === "\"") {
                current += "\"";
                index += 1;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === "," && !inQuotes) {
            values.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }

    values.push(current.trim());

    return values.map((value) => {
        if (value.startsWith("\"") && value.endsWith("\"")) {
            return value.slice(1, -1).replace(/\"\"/g, "\"").trim();
        }
        return value;
    });
};
const parseCsv = (csvText) => {
    if (!csvText) {
        throw new Error("The selected file is empty.");
    }

    const sanitized = csvText.replace(/^\uFEFF/, "");
    const lines = sanitized.split(/\r?\n/).filter((line) => line.trim().length > 0);

    if (lines.length < 2) {
        throw new Error("The CSV file must include a header row and at least one data row.");
    }

    const headers = splitCsvLine(lines[0]).map((header) => header.toLowerCase());
    if (!headers.length) {
        throw new Error("The CSV header row could not be parsed.");
    }

    const records = [];

    for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
        const rawLine = lines[lineIndex];
        if (!rawLine.trim()) {
            continue;
        }

        const values = splitCsvLine(rawLine);
        const record = {};
        headers.forEach((header, headerIndex) => {
            record[header] = values[headerIndex] ?? "";
        });
        records.push(record);
    }

    return records;
};

const formatCurrency = (amount, type) =>
    new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
    }).format(type === "debit" ? -Math.abs(amount) : Math.abs(amount));

const formatDate = (value) => {
    if (!value) {
        return "";
    }
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) {
        return value;
    }
    const date = new Date(Number.parseInt(year, 10), Number.parseInt(month, 10) - 1, Number.parseInt(day, 10));
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const typeLabelMap = {
    credit: "Credit",
    debit: "Debit",
};

const filterOptionLabel = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const sortGetValue = (transaction, key) => {
    if (key === "date") {
        return transaction.date;
    }
    if (key === "amount") {
        return transaction.amount;
    }
    if (key === "category") {
        return transaction.category;
    }
    if (key === "status") {
        return transaction.status;
    }
    return transaction.description;
};
const TransactionsPage = () => {
    const [allTransactions, setAllTransactions] = useState(sampleTransactions);
    const [filters, setFilters] = useState(defaultFilters);
    const [sortState, setSortState] = useState({ key: "date", direction: "desc" });
    const [feedback, setFeedback] = useState(null);
    const fileInputRef = useRef(null);

    const categories = useMemo(() => {
        const unique = new Set(allTransactions.map((transaction) => transaction.category));
        return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
    }, [allTransactions]);

    const filteredTransactions = useMemo(() => {
        return allTransactions.filter((transaction) => {
            const query = filters.search.trim().toLowerCase();
            if (query) {
                const matches =
                    transaction.description.toLowerCase().includes(query) ||
                    transaction.account.toLowerCase().includes(query) ||
                    transaction.category.toLowerCase().includes(query) ||
                    (transaction.notes ?? "").toLowerCase().includes(query) ||
                    (transaction.tags ?? []).some((tag) => tag.toLowerCase().includes(query));
                if (!matches) {
                    return false;
                }
            }

            if (filters.type !== "all" && transaction.type !== filters.type) {
                return false;
            }

            if (filters.status !== "all" && transaction.status !== filters.status) {
                return false;
            }

            if (filters.category !== "all" && transaction.category !== filters.category) {
                return false;
            }

            if (filters.startDate && transaction.date < filters.startDate) {
                return false;
            }

            if (filters.endDate && transaction.date > filters.endDate) {
                return false;
            }

            const minAmount = toNumberOrNull(filters.minAmount);
            if (minAmount !== null && transaction.amount < minAmount) {
                return false;
            }

            const maxAmount = toNumberOrNull(filters.maxAmount);
            if (maxAmount !== null && transaction.amount > maxAmount) {
                return false;
            }

            return true;
        });
    }, [allTransactions, filters]);

    const sortedTransactions = useMemo(() => {
        const data = [...filteredTransactions];
        data.sort((a, b) => {
            const valueA = sortGetValue(a, sortState.key);
            const valueB = sortGetValue(b, sortState.key);

            if (sortState.key === "date") {
                if (valueA < valueB) {
                    return sortState.direction === "asc" ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortState.direction === "asc" ? 1 : -1;
                }
                return 0;
            }

            if (sortState.key === "amount") {
                const diff = Number(valueA) - Number(valueB);
                if (diff === 0) {
                    return 0;
                }
                return sortState.direction === "asc" ? diff : -diff;
            }

            const comparison = String(valueA ?? "").localeCompare(String(valueB ?? ""), undefined, {
                sensitivity: "base",
            });
            return sortState.direction === "asc" ? comparison : -comparison;
        });
        return data;
    }, [filteredTransactions, sortState]);

    const totals = useMemo(
        () =>
            filteredTransactions.reduce(
                (accumulator, transaction) => {
                    if (transaction.type === "credit") {
                        accumulator.inflow += transaction.amount;
                        accumulator.net += transaction.amount;
                    } else {
                        accumulator.outflow += transaction.amount;
                        accumulator.net -= transaction.amount;
                    }
                    return accumulator;
                },
                { inflow: 0, outflow: 0, net: 0 },
            ),
        [filteredTransactions],
    );

    const resultsCount = filteredTransactions.length;

    const handleFilterChange = (key) => (event) => {
        const { value } = event.target;
        setFilters((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    const handleSort = (key) => {
        setSortState((previous) => {
            if (previous.key === key) {
                return {
                    key,
                    direction: previous.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
        setSortState({ key: "date", direction: "desc" });
    };

    const triggerImport = () => {
        setFeedback(null);
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (!file.name.toLowerCase().endsWith(".csv")) {
            setFeedback({
                type: "error",
                message: "Please select a CSV file to import transactions.",
            });
            event.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = ({ target }) => {
            try {
                const text = String(target?.result ?? "");
                const rows = parseCsv(text);
                const timestamp = Date.now();
                let skipped = 0;

                const imported = rows
                    .map((row, index) => {
                        const description =
                            row.description ||
                            row.details ||
                            row.merchant ||
                            row.payee ||
                            "";

                        const rawAmount = row.amount ?? row.value ?? row.total ?? row.balance_change;
                        const amountValue = parseAmount(rawAmount);

                        const rawDate =
                            row.date ||
                            row.transaction_date ||
                            row.posted ||
                            row.post_date ||
                            "";
                        const normalizedDate = normalizeDate(rawDate);

                        if (!description || amountValue === null || !normalizedDate) {
                            skipped += 1;
                            return null;
                        }

                        const type = normalizeType(row.type ?? row.flow ?? row.direction, amountValue);
                        const status = normalizeStatus(row.status);
                        const absoluteAmount = Math.abs(amountValue);

                        const category =
                            row.category ||
                            row.group ||
                            row.segment ||
                            "Uncategorized";
                        const account =
                            row.account ||
                            row.account_name ||
                            row.source ||
                            "Imported account";

                        const tags = row.tags
                            ? row.tags
                                  .split(/[|,;]/)
                                  .map((tag) => tag.trim())
                                  .filter(Boolean)
                            : ["imported"];

                        return {
                            id: `import-${timestamp}-${index}`,
                            date: normalizedDate,
                            description,
                            category,
                            account,
                            type,
                            status,
                            amount: absoluteAmount,
                            notes: row.note || row.notes || "Imported via CSV",
                            tags,
                        };
                    })
                    .filter(Boolean);

                if (!imported.length) {
                    throw new Error("No rows could be imported. Check the column headers or data formatting.");
                }

                setAllTransactions((previous) => [...previous, ...imported]);

                const summary = [
                    `Imported ${imported.length} transaction${imported.length === 1 ? "" : "s"} from ${file.name}`,
                ];
                if (skipped) {
                    summary.push(
                        `${skipped} row${skipped === 1 ? "" : "s"} skipped because of missing amount, description, or date`,
                    );
                }

                setFeedback({
                    type: "success",
                    message: `${summary.join(". ")}.`,
                });
            } catch (error) {
                setFeedback({
                    type: "error",
                    message:
                        error instanceof Error ? error.message : "Unable to import the selected CSV file.",
                });
            }
        };

        reader.onerror = () => {
            setFeedback({
                type: "error",
                message: "The file could not be read. Please try again with a different CSV file.",
            });
        };

        reader.readAsText(file);
        event.target.value = "";
    };
    const handleExportPdf = () => {
    if (!sortedTransactions.length) {
        setFeedback({
            type: "error",
            message: "No transactions available to export. Adjust your filters or import data first.",
        });
        return;
    }

    const doc = new jsPDF({ orientation: "landscape", unit: "pt" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    let cursorY = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Transaction export", margin, cursorY);
    cursorY += 22;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated ${new Date().toLocaleString()}`, margin, cursorY);
    cursorY += 16;

    const activeFilters = [];

    if (filters.type !== "all") {
        activeFilters.push(`Type: ${typeLabelMap[filters.type] ?? filters.type}`);
    }
    if (filters.status !== "all") {
        activeFilters.push(`Status: ${filterOptionLabel(filters.status)}`);
    }
    if (filters.category !== "all") {
        activeFilters.push(`Category: ${filters.category}`);
    }
    if (filters.startDate || filters.endDate) {
        activeFilters.push(`Date: ${filters.startDate || "any"} to ${filters.endDate || "any"}`);
    }
    if (filters.minAmount || filters.maxAmount) {
        activeFilters.push(
            `Amount: ${filters.minAmount || "0"} to ${filters.maxAmount || "any"}`
        );
    }

    if (activeFilters.length) {
        const filterText = `Filters: ${activeFilters.join("; ")}`;
        const filterLines = doc.splitTextToSize(filterText, pageWidth - margin * 2);
        filterLines.forEach((line) => {
            doc.text(line, margin, cursorY);
            cursorY += 14;
        });
    } else {
        doc.text("Filters: none applied", margin, cursorY);
        cursorY += 16;
    }

    const totalsSummary = `Inflow ${formatCurrency(totals.inflow, "credit")} | Outflow ${formatCurrency(
        totals.outflow,
        "debit"
    )} | Net ${new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(totals.net)}`;
    const totalLines = doc.splitTextToSize(totalsSummary, pageWidth - margin * 2);
    totalLines.forEach((line) => {
        doc.text(line, margin, cursorY);
        cursorY += 14;
    });
    cursorY += 6;

    const columns = [
        { header: "Date", width: 80, accessor: (transaction) => formatDate(transaction.date) },
        { header: "Description", width: 220, accessor: (transaction) => transaction.description },
        { header: "Category", width: 110, accessor: (transaction) => transaction.category },
        { header: "Type", width: 70, accessor: (transaction) => typeLabelMap[transaction.type] ?? transaction.type },
        { header: "Status", width: 90, accessor: (transaction) => filterOptionLabel(transaction.status) },
        {
            header: "Amount",
            width: 90,
            accessor: (transaction) => formatCurrency(transaction.amount, transaction.type),
            align: "right",
        },
    ];

    const tableWidth = columns.reduce((sum, column) => sum + column.width, 0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    let headerX = margin;
    columns.forEach((column) => {
        const xPosition = column.align === "right" ? headerX + column.width : headerX;
        doc.text(column.header, xPosition, cursorY, column.align === "right" ? { align: "right" } : undefined);
        headerX += column.width;
    });

    cursorY += 8;
    doc.setLineWidth(0.5);
    doc.line(margin, cursorY, margin + tableWidth, cursorY);
    cursorY += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const lineHeight = 14;
    const bottomMargin = margin;

    sortedTransactions.forEach((transaction) => {
        const rowLines = columns.map((column) => {
            const value = column.accessor(transaction);
            const availableWidth = column.width - 10;
            const lines = doc.splitTextToSize(String(value ?? ""), availableWidth);
            return lines.length;
        });
        const rowHeight = Math.max(...rowLines) * lineHeight;

        if (cursorY + rowHeight > pageHeight - bottomMargin) {
            doc.addPage();
            cursorY = margin;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            let repeatX = margin;
            columns.forEach((column) => {
                const xPosition = column.align === "right" ? repeatX + column.width : repeatX;
                doc.text(column.header, xPosition, cursorY, column.align === "right" ? { align: "right" } : undefined);
                repeatX += column.width;
            });

            cursorY += 8;
            doc.line(margin, cursorY, margin + tableWidth, cursorY);
            cursorY += 12;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
        }

        let cellX = margin;
        columns.forEach((column) => {
            const value = column.accessor(transaction);
            const availableWidth = column.width - 10;
            const lines = doc.splitTextToSize(String(value ?? ""), availableWidth);

            lines.forEach((line, index) => {
                const textY = cursorY + lineHeight * index;
                if (column.align === "right") {
                    doc.text(line, cellX + column.width - 2, textY, { align: "right" });
                } else {
                    doc.text(line, cellX + 2, textY);
                }
            });

            cellX += column.width;
        });

        cursorY += rowHeight;
    });

    doc.save(`transactions-${new Date().toISOString().slice(0, 10)}.pdf`);

    setFeedback({
        type: "success",
        message: `Exported ${sortedTransactions.length} transaction${sortedTransactions.length === 1 ? "" : "s"} to PDF.`,
    });
};

    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Transactions</h1>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Review activity, filter important entries, and keep your ledger audit-ready.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        type="button"
                        onClick={triggerImport}
                        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200/70 bg-surface px-3 py-2 text-sm font-semibold text-neutral-600 transition hover:border-primary-200 hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:border-neutral-700 dark:bg-surface-dark dark:text-neutral-100 dark:hover:border-primary-400/60"
                    >
                        <Upload className="h-4 w-4" />
                        Import CSV
                    </button>
                    <button
                        type="button"
                        onClick={handleExportPdf}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                        <FileDown className="h-4 w-4" />
                        Export PDF
                    </button>
                </div>
            </div>

            {feedback ? (
                <div
                    className={cn(
                        "flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm",
                        feedback.type === "error"
                            ? "border-danger-200 bg-danger-50 text-danger-700 dark:border-danger-700/50 dark:bg-danger-900/20 dark:text-danger-100"
                            : "border-success-200 bg-success-50 text-success-700 dark:border-success-700/50 dark:bg-success-900/20 dark:text-success-100",
                    )}
                >
                    <div className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-current" />
                        <p className="leading-5">{feedback.message}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFeedback(null)}
                        className="text-xs font-medium text-current transition hover:opacity-70"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : null}

            <Card>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 dark:text-neutral-300">
                        <SlidersHorizontal className="h-4 w-4" />
                        Refine results
                    </div>
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="text-sm font-medium text-primary-600 transition hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                        Reset filters
                    </button>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="md:col-span-2 xl:col-span-3">
                        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Search
                        </label>
                        <SearchInput
                            className="mt-1"
                            value={filters.search}
                            onChange={(event) =>
                                setFilters((previous) => ({
                                    ...previous,
                                    search: event.target.value,
                                }))
                            }
                            placeholder="Search description, account, or tags"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Type
                        </label>
                        <select
                            value={filters.type}
                            onChange={handleFilterChange("type")}
                            className={inputBaseClasses}
                        >
                            <option value="all">All types</option>
                            <option value="credit">Credits</option>
                            <option value="debit">Debits</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={handleFilterChange("status")}
                            className={inputBaseClasses}
                        >
                            <option value="all">All statuses</option>
                            <option value="cleared">Cleared</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Category
                        </label>
                        <select
                            value={filters.category}
                            onChange={handleFilterChange("category")}
                            className={inputBaseClasses}
                        >
                            {categories.map((categoryValue) => (
                                <option key={categoryValue} value={categoryValue}>
                                    {categoryValue === "all" ? "All categories" : categoryValue}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            From date
                        </label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={handleFilterChange("startDate")}
                            className={inputBaseClasses}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            To date
                        </label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={handleFilterChange("endDate")}
                            className={inputBaseClasses}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Min amount
                        </label>
                        <input
                            type="number"
                            value={filters.minAmount}
                            onChange={handleFilterChange("minAmount")}
                            className={inputBaseClasses}
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Max amount
                        </label>
                        <input
                            type="number"
                            value={filters.maxAmount}
                            onChange={handleFilterChange("maxAmount")}
                            className={inputBaseClasses}
                            placeholder="5000.00"
                        />
                    </div>
                </div>
            </Card>

            <Card>
                <div className="grid gap-6 sm:grid-cols-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Total inflow
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-success-600 dark:text-success-400">
                            {formatCurrency(totals.inflow, "credit")}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Total outflow
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-danger-600 dark:text-danger-400">
                            {formatCurrency(totals.outflow, "debit")}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                            Net change
                        </p>
                        <p
                            className={cn(
                                "mt-2 text-2xl font-semibold",
                                totals.net >= 0
                                    ? "text-success-600 dark:text-success-400"
                                    : "text-danger-600 dark:text-danger-400",
                            )}
                        >
                            {new Intl.NumberFormat(undefined, {
                                style: "currency",
                                currency: "USD",
                            }).format(totals.net)}
                        </p>
                        <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
                            Showing {resultsCount} of {allTransactions.length} transactions
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden" padding="p-0">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/70 px-6 py-4 dark:border-neutral-800">
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                            Transaction history
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Sort columns to analyze spending patterns.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                        <Filter className="h-4 w-4" />
                        {resultsCount} matching
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200/70 text-left text-sm dark:divide-neutral-800">
                        <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:bg-surface-dark-muted dark:text-neutral-400">
                            <tr>
                                <th scope="col" className="px-6 py-4">
                                    <button
                                        type="button"
                                        className="flex items-center gap-2"
                                        onClick={() => handleSort("date")}
                                    >
                                        Date
                                        <ArrowUpDown
                                            className={cn(
                                                "h-4 w-4 text-neutral-400 transition",
                                                sortState.key === "date" ? "text-primary-500" : "",
                                                sortState.key === "date" && sortState.direction === "asc"
                                                    ? "rotate-180"
                                                    : "",
                                            )}
                                        />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    Details
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    <button
                                        type="button"
                                        className="flex items-center gap-2"
                                        onClick={() => handleSort("category")}
                                    >
                                        Category
                                        <ArrowUpDown
                                            className={cn(
                                                "h-4 w-4 text-neutral-400 transition",
                                                sortState.key === "category" ? "text-primary-500" : "",
                                                sortState.key === "category" && sortState.direction === "asc"
                                                    ? "rotate-180"
                                                    : "",
                                            )}
                                        />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    <button
                                        type="button"
                                        className="flex items-center gap-2"
                                        onClick={() => handleSort("status")}
                                    >
                                        Status
                                        <ArrowUpDown
                                            className={cn(
                                                "h-4 w-4 text-neutral-400 transition",
                                                sortState.key === "status" ? "text-primary-500" : "",
                                                sortState.key === "status" && sortState.direction === "asc"
                                                    ? "rotate-180"
                                                    : "",
                                            )}
                                        />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-4 text-right">
                                    <button
                                        type="button"
                                        className="flex items-center gap-2"
                                        onClick={() => handleSort("amount")}
                                    >
                                        Amount
                                        <ArrowUpDown
                                            className={cn(
                                                "h-4 w-4 text-neutral-400 transition",
                                                sortState.key === "amount" ? "text-primary-500" : "",
                                                sortState.key === "amount" && sortState.direction === "asc"
                                                    ? "rotate-180"
                                                    : "",
                                            )}
                                        />
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200/70 text-sm text-neutral-600 dark:divide-neutral-800 dark:text-neutral-200">
                            {sortedTransactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="hover:bg-primary-50/40 dark:hover:bg-neutral-800/50"
                                >
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-neutral-700 dark:text-neutral-100">
                                        {formatDate(transaction.date)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-neutral-800 dark:text-neutral-100">
                                            {transaction.description}
                                        </div>
                                        <div className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                                            {transaction.account}
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <Badge variant="default">
                                                {typeLabelMap[transaction.type] ?? transaction.type}
                                            </Badge>
                                            {transaction.tags?.map((tag) => (
                                                <span
                                                    key={`${transaction.id}-${tag}`}
                                                    className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-neutral-500 dark:text-neutral-300">
                                        {transaction.category}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <Badge variant={statusVariantMap[transaction.status] ?? "default"}>
                                            {filterOptionLabel(transaction.status)}
                                        </Badge>
                                    </td>
                                    <td
                                        className={cn(
                                            "whitespace-nowrap px-6 py-4 text-right text-sm font-semibold",
                                            transaction.type === "credit"
                                                ? "text-success-600 dark:text-success-400"
                                                : "text-danger-600 dark:text-danger-400",
                                        )}
                                    >
                                        {formatCurrency(transaction.amount, transaction.type)}
                                    </td>
                                </tr>
                            ))}
                            {!sortedTransactions.length ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-sm text-neutral-400 dark:text-neutral-500"
                                    >
                                        No transactions match the current filters. Try adjusting the filters or importing new data.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </Card>
        </section>
    );
};

export default TransactionsPage;


