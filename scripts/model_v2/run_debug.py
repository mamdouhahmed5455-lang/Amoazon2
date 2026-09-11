import sys
import traceback
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

out_log = Path("run_output.txt")

try:
    with open(out_log, "w", encoding="utf-8") as f:
        f.write("Starting run_model_v2...\n")
        f.flush()
        
        # Redirect stdout and stderr to file
        sys.stdout = f
        sys.stderr = f
        
        from scripts.model_v2.run import run_model_v2
        run_model_v2()
        
        f.write("\nFinished run_model_v2 successfully.\n")
except Exception as e:
    with open(out_log, "a", encoding="utf-8") as f:
        f.write(f"\nFATAL EXCEPTION: {e}\n")
        traceback.print_exc(file=f)
