import React from "react";
import { addons, types } from "storybook/internal/manager-api";

import { ADDON_ID, TOOL_ID } from "./constants";
import { SearchBar } from "src/ui/SearchBar";
/**
 * Note: if you want to use JSX in this file, rename it to `manager.tsx`
 * and update the entry prop in tsup.config.ts to use "src/manager.tsx",
 */

// Register the addon
addons.register(ADDON_ID, (api) => {
  // Register textsearch as tool
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "Text Search",
    render: () => <SearchBar />,
  });
});
