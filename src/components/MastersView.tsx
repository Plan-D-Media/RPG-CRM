import React, { useState } from 'react';
import { MasterCategoryType, MasterItem } from '../types/crmExtended';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Check, 
  Search, 
  Layers, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface MastersViewProps {
  masters: MasterItem[];
  selectedCategory: MasterCategoryType;
  onSelectCategory: (cat: MasterCategoryType) => void;
  onAddMasterItem: (item: MasterItem) => void;
  onDeleteMasterItem: (id: string) => void;
}

export const MastersView: React.FC<MastersViewProps> = ({
  masters,
  selectedCategory,
  onSelectCategory,
  onAddMasterItem,
  onDeleteMasterItem
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCode, setNewItemCode] = useState('');

  const categories: MasterCategoryType[] = [
    'Region',
    'Complaint Source',
    'Product Category',
    'Product Name',
    'Product Flavour',
    'Plant Name',
    'Response',
    'Complaint Category',
    'Complaint Sub Category',
    'Complaint Status'
  ];

  const currentItems = masters.filter(m => m.category === selectedCategory);
  const filteredItems = currentItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: MasterItem = {
      id: `mst-${Date.now()}`,
      category: selectedCategory,
      name: newItemName.trim(),
      code: newItemCode.trim() || `MST-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Active'
    };

    onAddMasterItem(newItem);
    setNewItemName('');
    setNewItemCode('');
    setIsAdding(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={24} color="var(--brand-primary)" />
            <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
              Master Configuration Console
            </h1>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Centralized dictionary governing Plants, Flavors, SKUs, Regions, Defect Categories, and Standard Responses.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="btn btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Plus size={16} />
          <span>Add New {selectedCategory}</span>
        </button>
      </div>

      {/* Category Pills Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '8px 4px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            style={{
              padding: '7px 14px',
              borderRadius: '9999px',
              border: selectedCategory === cat ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
              background: selectedCategory === cat ? 'var(--brand-gradient)' : 'rgba(255,255,255,0.05)',
              color: selectedCategory === cat ? '#FFF' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: selectedCategory === cat ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {cat} ({masters.filter(m => m.category === cat).length})
          </button>
        ))}
      </div>

      {/* Add New Master Modal / Form Box */}
      {isAdding && (
        <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--border-glow)', background: 'rgba(255, 74, 28, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>
              Create New Entry in "{selectedCategory}"
            </h3>
            <button onClick={() => setIsAdding(false)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveItem} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: '12px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder={`Enter ${selectedCategory} Name (e.g. Masala Crunch)...`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              required
              className="form-input"
            />
            <input 
              type="text" 
              placeholder="Code (optional, e.g. PLT-09)..."
              value={newItemCode}
              onChange={(e) => setNewItemCode(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Save Entry</span>
            </button>
          </form>
        </div>
      )}

      {/* Master Items Table */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder={`Search in ${selectedCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '0.82rem', height: '36px' }}
            />
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Total entries in <strong>{selectedCategory}</strong>: {filteredItems.length}
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '10px 8px' }}>Entry Name</th>
                <th style={{ padding: '10px 8px' }}>Reference Code</th>
                <th style={{ padding: '10px 8px' }}>Category</th>
                <th style={{ padding: '10px 8px' }}>Status</th>
                <th style={{ padding: '10px 8px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 600, color: '#FFF' }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '12px 8px', fontFamily: 'var(--font-mono)', color: 'var(--brand-accent)', fontSize: '0.8rem' }}>
                    {item.code || '—'}
                  </td>
                  <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                    {item.category}
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span className="badge badge-low">{item.status}</span>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <button
                      onClick={() => onDeleteMasterItem(item.id)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', color: '#EF4444' }}
                      title="Delete Entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
