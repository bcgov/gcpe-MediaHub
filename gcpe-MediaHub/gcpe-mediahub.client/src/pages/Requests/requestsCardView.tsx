import React, { useState } from "react";
import { Input, Badge, Tag, Tab, TabList, Avatar, TagGroup, Button, Title1, Divider, Drawer } from "@fluentui/react-components";
import { CalendarEmptyRegular, Filter24Regular, Search16Regular } from "@fluentui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { MediaRequest } from "../../api/generated-client/model";
import { requestService } from "../../services/requestService";
import type { RequestDto } from "../../api/generated-client/model";
import styles from "./requestsCardView.module.css";
import NewRequestPage from './newRequest';
import RequestDetailView from './requestDetailView';
import RequestStatusBadge from "../../components/RequestStatusBadge";

const RequestsCardView: React.FC = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const { data: requests = [], isLoading, error, refetch } = useQuery<RequestDto[], Error>({
    queryKey: ["requests"],
    queryFn: async () => {
      return await requestService.getRequestDtos();
    },
  });

  // Debug: log the loaded requests to inspect requestStatus
  React.useEffect(() => {
    if (requests.length > 0) {
      console.log("Loaded requests:", requests);
    }
  }, [requests]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "requestTitle",
        header: "Request Title",
      },
      {
        accessorKey: "requestorContact",
        header: "Requested By",
        cell: (info: any) => {
          const row = info.row.original as RequestDto;
          return `${row.requestorContactFirstName} ${row.requestorContactLastName}`;
        }
      },
      {
        accessorKey: "deadline",
        header: "Deadline",
        cell: (info: any) => {
          const dateValue = info.getValue();
          if (!dateValue) return "Invalid Date";
          try {
            const parsedDate = new Date(dateValue);
            return isNaN(parsedDate.getTime()) 
              ? "Invalid Date" 
              : parsedDate.toLocaleDateString();
          } catch (error) {
            return "Invalid Date";
          }
        },
      },
      {
        accessorKey: "leadMinistry",
        header: "Lead Ministry",
        cell: (info: any) => {
          const row = info.row.original as RequestDto;
          return row.leadMinistryAbbr;
        }
      },
      {
        accessorKey: "additionalMinistriesAbbr",
        header: "Additional Ministry",
        cell: (info: any) => {
          const row = info.row.original as RequestDto;
          return row.additionalMinistriesAbbr?.join(", ");
        }
      },
      {
        accessorKey: "requestorOutlet",
        header: "Outlet",
        cell: (info: any) => info.getValue()?.outletName || 'Unknown'
      },
      {
        accessorKey: "requestStatus",
        header: "Status",
        cell: (info: any) => (
          <RequestStatusBadge status={info.row.original.requestStatus || 'Unknown'} />
        )
      },
    ],
    []
  );

  const filteredRequests = React.useMemo(() => {
    if (!globalFilter) return requests;
    const filterLower = globalFilter.toLowerCase();
    return requests.filter(request =>
      request.requestTitle?.toLowerCase().includes(filterLower) ||
      (`${request.requestorContactFirstName} ${request.requestorContactLastName}`.toLowerCase().includes(filterLower)) ||
      (request.leadMinistryAbbr?.toLowerCase().includes(filterLower)) ||
      (request.additionalMinistriesAbbr?.join(",").toLowerCase().includes(filterLower))
    );
  }, [requests, globalFilter]);

  const table = useReactTable({
    data: filteredRequests,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
  });

  // Handler for closing the new request drawer and refreshing the list
  const handleCloseNewRequest = () => {
    setIsDrawerOpen(false);
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading requests: {error.message}</div>;

  return (
    <div className={styles.layoutWrapper}>
      <div className={`${styles.mainContent} ${selectedRequestId ? styles.mainContentWithDetail : ''}`} style={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
        <div style={{ width: '100%', overflowY: 'auto', maxHeight: '100%', padding: '20px' }}>
          <div className={styles.headerContainer}>
            <Title1>Media Requests</Title1>
            <Button appearance="primary" onClick={() => setIsDrawerOpen(true)}>Create new</Button>
          </div>

          <div className={styles.controls}>
            <TabList selectedValue={selectedTab} onTabSelect={(_, data) => setSelectedTab(data.value as string)}>
              <Tab value="all">All</Tab>
            </TabList>
            <div className={styles.searchAndFilterContainer}>
              <Input
                contentBefore={<Search16Regular />}
                placeholder="Search requests"
                value={globalFilter}
                onChange={(_, data) => setGlobalFilter(data.value || "")}
                className={styles.searchInput}
              />
              <Button
                icon={<Filter24Regular />}
                appearance="outline"
                className={styles.filterButton}
              >
                Filter
              </Button>
            </div>
          </div>

          <div className={styles.container}>
            {table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                className={`${styles.card} ${selectedRequestId === row.original.id ? styles.selectedCard : ''}`}
                onClick={() => setSelectedRequestId(row.original.id)}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{`REQ-${row.original.requestNo}`}</span>
                    <div className={styles.statusBadge}>
                      <RequestStatusBadge status={row.original.requestStatus || "Unknown"} />
                    </div>
                  </div>
                  <h3>{row.original.requestTitle}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Avatar 
                      name={`${row.original.requestorContactFirstName} ${row.original.requestorContactLastName}`}
                      size={24} 
                    />
                    <span>
                      {row.original.requestorContactFirstName} {row.original.requestorContactLastName}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarEmptyRegular />
                    <span>
                      {row.original.deadline 
                        ? new Date(row.original.deadline).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
                        : "No deadline"
                      }
                    </span>
                  </div>
                  <Divider />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TagGroup className={styles.ministryTags}>
                      {row.original.leadMinistryAbbr && (
                        <Tag shape="circular" appearance="outline">{row.original.leadMinistryAbbr}</Tag>
                      )}
                      {row.original.additionalMinistriesAbbr?.length > 0 && (
                        <Tag shape="circular" appearance="outline">{row.original.additionalMinistriesAbbr[0]}</Tag>
                      )}
                    </TagGroup>
                    {row.original.assignedToFullName && (
                      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '8px' }}>
                        <Avatar
                          name={row.original.assignedToFullName}
                          size={24}
                          initials={
                            row.original.assignedToFullName
                              ? row.original.assignedToFullName.slice(0, 2).toUpperCase()
                              : ""
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedRequestId && (
          <div style={{ width: '100%', position: 'sticky', top: 0, height: '100%', overflow: 'hidden' }}>
            <RequestDetailView
              requestId={selectedRequestId}
              onClose={() => setSelectedRequestId(null)}
            />
          </div>
        )}
      </div>

      <Drawer
        type="overlay"
        separator
        position="end"
        open={isDrawerOpen}
        onOpenChange={(_, { open }) => setIsDrawerOpen(open)}
        style={{ width: '650px' }}
      >
        <div className={styles.drawerContent}>
          <NewRequestPage onClose={handleCloseNewRequest} />
        </div>
      </Drawer>
    </div>
  );
};

export default RequestsCardView;