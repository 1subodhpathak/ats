import { useEffect, useMemo } from "react";

import { debounce } from "../utils/debounce";

function useAutoSave(callback, delay = 700) {
  const debounced = useMemo(() => debounce(callback, delay), [callback, delay]);

  useEffect(() => () => debounced.cancel(), [debounced]);

  return debounced;
}

export default useAutoSave;
