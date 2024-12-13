import { useState } from 'react';

export const ASSETS = {
  ship: new Image(),
  iceberg: new Image(),
  goal: new Image(),
};

export const useGameAssets = () => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const loadAssets = () => {
    let loadedCount = 0;
    const totalAssets = Object.keys(ASSETS).length;

    const onLoad = () => {
      loadedCount++;
      if (loadedCount === totalAssets) {
        setAssetsLoaded(true);
      }
    };

    // Load ship image
    ASSETS.ship.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA2MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAxNUwxNSA1TDQ1IDVMNjAgMTVMNDUgMjVMMTUgMjVMMCAxNVoiIGZpbGw9IiM0QTU1NjgiLz48cGF0aCBkPSJNMTUgMTBIMjVWMjBIMTVWMTBaIiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggZD0iTTM1IDEwSDQ1VjIwSDM1VjEwWiIgZmlsbD0iI0ZGRkZGRiIvPjwvc3ZnPg==';
    ASSETS.ship.onload = onLoad;

    // Load iceberg image
    ASSETS.iceberg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA4MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAyMEwyMCA1TDYwIDVMODAgMjBMNjAgMzVMMjAgMzVMMCAyMFoiIGZpbGw9IiNBMEFFQjIiLz48cGF0aCBkPSJNMjAgMTBMNDAgMTBMNjAgMjVMNDAgMjVMMjAgMTBaIiBmaWxsPSIjRTJFOEYwIi8+PC9zdmc+';
    ASSETS.iceberg.onload = onLoad;

    // Load goal zone image
    ASSETS.goal.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgODAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBIODAwVjUwSDBWMFoiIGZpbGw9IiM0QzUxQkYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PHBhdGggZD0iTTAgMEg1MFY1MEgwVjBaIiBmaWxsPSIjNEM1MUJGIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGQ9Ik0xMDAgMEgxNTBWNTBIMTAwVjBaIiBmaWxsPSIjNEM1MUJGIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGQ9Ik0yMDAgMEgyNTBWNTBIMjAwVjBaIiBmaWxsPSIjNEM1MUJGIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGQ9Ik0zMDAgMEgzNTBWNTBIMzAwVjBaIiBmaWxsPSIjNEM1MUJGIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGQ9Ik00MDAgMEg0NTBWNTBINDAwVjBaIiBmaWxsPSIjNEM1MUJGIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGQ9Ik01MDAgMEg1NTBWNTBINTAwVjBaIiBmaWxsPSIjNEM1MUJGIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGQ9Ik02MDAgMEg2NTBWNTBINjAwVjBaIiBmaWxsPSIjNEM1MUJGIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjxwYXRoIGQ9Ik03MDAgMEg3NTBWNTBINzAwVjBaIiBmaWxsPSIjNEM1MUJGIiBmaWxsLW9wYWNpdHk9IjAuNCIvPjwvc3ZnPg==';
    ASSETS.goal.onload = onLoad;
  };

  return { assetsLoaded, loadAssets };
};
