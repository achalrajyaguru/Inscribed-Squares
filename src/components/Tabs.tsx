import React, { useState } from 'react';
import { CanvasBoard } from './CanvasBoard';
import { Theory } from './Theory';

type Tab = 'canvas' | 'theory';

export function Tabs() {
  const [activeTab, setActiveTab] = useState<Tab>('canvas');

  return (
    <div className="tabs">
      <div className="tab-headers">
        <button
          className={`tab-header ${activeTab === 'canvas' ? 'active' : ''}`}
          onClick={() => setActiveTab('canvas')}
        >
          Canvas
        </button>
        <button
          className={`tab-header ${activeTab === 'theory' ? 'active' : ''}`}
          onClick={() => setActiveTab('theory')}
        >
          Theory
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'canvas' && <CanvasBoard />}
        {activeTab === 'theory' && <Theory />}
      </div>
    </div>
  );
}
