## Already built — quick verification plan

Your site already does this. Each table QR on the landing page (`#qr` section) and on `/print-qr` encodes a URL like `https://your-site/order/4`. When a guest scans the Table 4 code, their phone opens `/order/4` and the page shows "Table 4" in the header and tags every placed order with `table_number: 4` automatically — no manual entry.

### How to use it
1. On the home page, scroll to "Print a QR for every table", set the number of tables (e.g. 10).
2. Click "Open print-ready sheet" → prints one QR per table.
3. Stick QR #4 on Table 4. Scanning it opens `/order/4`.

### If something isn't working
Tell me what you're seeing (e.g. "scanning opens the home page", "table number is blank", "wrong number shows") and I'll debug that specific case.

### Optional improvements I can add if you want
- Show the table number more prominently on the order page (large badge at top).
- Add a small "Table 4" label under each printed QR so staff can tell them apart at a glance (already present — confirm if you want it bigger).
- Let you customize the label per table (e.g. "Patio 1", "Bar 2") instead of just numbers.

Reply with which (if any) of these to build, or describe the issue if scanning isn't behaving as expected.
