# UI Redesign Implementation Plan

## Proposed Changes

We will implement the following UI structural changes in `index.html` to create a cleaner, more minimalist dashboard while preserving all functionality.

### 1. Analysis Sidebar (Right Panel) - Tabs Integration
We will refactor the `#analysisSidebar` from a long vertical list of cards into 3 distinct tabs:
- **Overview**: Selected Location, Risk Probability, Temporal Detection, Risk Class, Priority, Response Window, Confidence.
- **AI Insights**: Action Protocol, Explainable AI Drivers (SHAP). This tab will be hidden by default until a data point is clicked (as requested by the user).
- **Region**: Region Analysis (High Risk Points, Avg Risk Score, Predicted Area, Generate PDF Button) and Validation Evidence.

**Implementation Details:**
- Add CSS classes for `.tab-header`, `.tab-btn`, `.tab-content`, and `.tab-content.active`.
- Wrap the existing cards into three separate `<div class="tab-content" id="tab-overview">` etc.
- Add Javascript function `switchTab(tabId)` to handle toggling.

### 2. Control Panel (Left Panel) - Accordion Integration
We will refactor `#columnPanel` (the left control panel) to use collapsible sections to save vertical space.

**Implementation Details:**
- Add CSS for `.accordion-header`, `.accordion-content`, and `.accordion-icon`.
- Modify the existing `.control-section` wrappers to include a clickable header that toggles the height of the content.
- Sections to make collapsible:
  - Visualization Controls (Column Height, Minimum Risk, Heatmap Intensity, Performance Mode)
  - Camera Tools (Reset, Focus, Replay, Auto Rotate)
  - Scenario Comparison
  - Spatial Layers
- We will set the first one (Visualization Controls) to be open by default, and others closed.

## Verification Plan
1. **Manual Verification**:
   - Open `index.html` in the browser.
   - Verify the right sidebar now has 3 clickable tabs at the top.
   - Verify that clicking different tabs shows the correct content and hides the others.
   - Verify AI Insights is hidden initially.
   - Click a point to ensure AI insights populate correctly.
   - Verify the left control panel sections can be clicked to collapse and expand smoothly.
   - Confirm no existing functionality (like scenario selection or layer toggling) is broken by the UI restructuring.
