import { useEffect, useState } from "react";
import { getQueues } from "../../adapter/Dashboard";
import { data } from "react-router-dom";
const useQueueHooks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [queues, setQueues] = useState({
    data: [],
    count: 0,
  });
  const fetchQueues = async () => {
    setIsLoading(true);
    const response = await getQueues(page);
    if (response?.messageType === "S") {
        setQueues({
            data: response.data,
            count: response.count,
        });
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchQueues();
  }, [page]);
  return { isLoading, queues, page, setPage };
};

export default useQueueHooks;
