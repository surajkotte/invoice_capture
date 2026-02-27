import {
    useEffect,
    useState
} from "react";
import {
    getData,
    getLogs
} from "../../adapter/Dashboard";

const useAnalyticsHook = () => {
    const [listData, setListData] = useState([]);
    const [logs, setLogs] = useState({data: [], totalCount: 0, total_costs: 0});
    const [isLoading, setIsLoading] = useState(false);
    const fetchAnalyticsData = async () => {
        setIsLoading(true);
        try {
            const logsResponse = await getLogs();
            if (logsResponse?.messageType === "S") {
                setLogs({data: logsResponse?.data?.data || [], totalCount: logsResponse?.data?.totalCount || 0, total_costs: logsResponse?.data?.total_costs || 0});
            } else {
                setLogs({data: [], totalCount: 0, total_costs: 0});
            }
        } catch (error) {
            setLogs({data: [], totalCount: 0, total_costs: 0});
        }
        finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchAnalyticsData();
    }, [])
    return {
        listData,
        logs,
        isLoading,
    }
}

export default useAnalyticsHook;