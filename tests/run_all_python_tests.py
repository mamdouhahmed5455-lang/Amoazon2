"""
Master test runner executing all Python unit test suites across reproduction,
PRODES validation, and validation redesign modules.
"""

import unittest
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

def suite():
    loader = unittest.TestLoader()
    full_suite = unittest.TestSuite()
    
    test_dirs = [
        PROJECT_ROOT / "tests" / "reproduction",
        PROJECT_ROOT / "tests" / "prodes_validation",
        PROJECT_ROOT / "tests" / "validation_redesign",
        PROJECT_ROOT / "tests" / "model_v2"
    ]
    
    for d in test_dirs:
        if d.exists():
            discovered = loader.discover(start_dir=str(d), pattern="test_*.py")
            full_suite.addTests(discovered)
            
    return full_suite

if __name__ == "__main__":
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite())
    sys.exit(0 if result.wasSuccessful() else 1)
