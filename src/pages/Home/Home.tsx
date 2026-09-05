import React from "react";

type TableColumn = { label: string; key: string; align?: "right" };

const snapshot = [
  ["Today's Milk Purchased", "240 L", "1 purchase entry today", "green"],
  ["Today's Milk Sold", "0 L", "0 sale entries today", "blue"],
  ["Current Market Rate", "₹71.00/L", "Effective from 01 Aug 2026", "gold"],
  ["Today's Purchase Amount", "₹13,824.00", "FAT-based, across all suppliers", "orange"],
  ["Today's Sales Amount", "N/A", "At the active market rate", "muted"],
  ["Supplier Outstanding", "₹31,414.00", "Total payable to all suppliers", "rose"],
  ["Customer Outstanding", "₹19,060.00", "Total receivable from all customers", "purple"],
];

const purchases = [["12 Sept 2026", "Shree Krishna Dairy", "200 L", "6.5", "₹11,700.00"], ["05 Sept 2026", "Shree Krishna Dairy", "240 L", "6.4", "₹13,824.00"], ["03 Sept 2026", "Malwa Milk Suppliers", "160 L", "6.6", "₹9,504.00"], ["02 Sept 2026", "Shree Krishna Dairy", "200 L", "6.5", "₹11,700.00"]];
const sales = [["06 Sept 2026", "Sharma General Store", "200 L", "₹71.00", "₹14,200.00"], ["04 Sept 2026", "Patel Khowa Center", "40 L", "₹71.00", "₹2,840.00"], ["02 Sept 2026", "Anand Sweets", "120 L", "₹71.00", "₹8,520.00"]];
const payments = [["05 Sept 2026", "Patel Khowa Center", "Customer", "₹1,500.00"], ["04 Sept 2026", "Shree Krishna Dairy", "Supplier", "₹15,314.00"], ["03 Sept 2026", "Anand Sweets", "Customer", "₹5,000.00"]];

const DataTable = ({ columns, rows }: { columns: TableColumn[]; rows: string[][] }) => (
  <div className="table-wrap"><table><thead><tr>{columns.map(column => <th key={column.key} className={column.align}>{column.label}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} className={columns[cellIndex]?.align}>{cell}</td>)}</tr>)}</tbody></table></div>
);

const DataPanel = ({ title, children, action = "View all →" }: { title: string; children: React.ReactNode; action?: string }) => (
  <section className="data-panel"><div className="panel-heading"><h2>{title}</h2>{action && <button className="link-button">{action}</button>}</div>{children}</section>
);

const Home: React.FC = () => {
  const [showAll, setShowAll] = React.useState(false);

  return (
    <div className="dashboard-page">
      <div className="dashboard-section-heading"><h1>Today's snapshot</h1><span>05 Sept 2026</span></div>
      {showAll && <div className="quick-actions"><button onClick={() => setShowAll(false)}>Purchase milk</button><button onClick={() => setShowAll(false)}>Record sale</button><button onClick={() => setShowAll(false)}>Add payment</button></div>}
      <section className="snapshot-grid">
        {snapshot.map(([label, value, note, tone]) => <article className={`snapshot-card ${tone}`} key={label}><p>{label}</p><strong>{value}</strong><small>{note}</small></article>)}
      </section>
      <div className="section-title"><h2>Activity overview</h2><span>Last 30 days <b>⌄</b></span></div>
      <div className="panels-grid">
        <DataPanel title="Recent purchases"><DataTable columns={[{ label: "Date", key: "date" }, { label: "Supplier", key: "supplier" }, { label: "Litres", key: "litres" }, { label: "FAT", key: "fat" }, { label: "Amount", key: "amount", align: "right" }]} rows={purchases} /></DataPanel>
        <DataPanel title="Recent sales"><DataTable columns={[{ label: "Date", key: "date" }, { label: "Customer", key: "customer" }, { label: "Litres", key: "litres" }, { label: "Rate", key: "rate" }, { label: "Amount", key: "amount", align: "right" }]} rows={sales} /></DataPanel>
        <DataPanel title="Recent payments"><DataTable columns={[{ label: "Date", key: "date" }, { label: "Party", key: "party" }, { label: "Type", key: "type" }, { label: "Amount", key: "amount", align: "right" }]} rows={payments} /></DataPanel>
        <DataPanel title="Pending bills" action=""><div className="pending-list"><div><span>Supplier bills awaiting settlement</span><strong>3</strong></div><div><span>Customer bills with outstanding balance</span><strong>3</strong></div></div><div className="panel-actions"><button>View supplier bills</button><button>View customer bills</button></div></DataPanel>
      </div>
      <div className="dashboard-note"><span>✦</span><p><b>Everything is in one place.</b> Your daily milk business snapshot updates as you add purchases, sales and payments.</p><button onClick={() => setShowAll(!showAll)}>New entry</button></div>
    </div>
  );
};

export default Home;
