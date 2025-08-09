import { createContext, useContext, useId, useMemo, forwardRef } from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" };

export function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartContext = createContext(null);

export const ChartContainer = forwardRef(
  ({ id, className, children, config, ...props }, ref) => {
    const uniqueId = useId();
    const chartId = `chart-${(id || uniqueId).replace(/:/g, "")}`;

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          data-chart={chartId}
          ref={ref}
          className={cn(
            "flex aspect-video justify-center text-xs " +
              "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground " +
              "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 " +
              "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border " +
              "[&_.recharts-dot[stroke='#fff']]:stroke-transparent " +
              "[&_.recharts-layer]:outline-none " +
              "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border " +
              "[&_.recharts-radial-bar-background-sector]:fill-muted " +
              "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted " +
              "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border " +
              "[&_.recharts-sector[stroke='#fff']]:stroke-transparent " +
              "[&_.recharts-sector]:outline-none " +
              "[&_.recharts-surface]:outline-none",
            className
          )}
          {...props}
        >
          <ChartStyle id={chartId} config={config} />
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

const ChartStyle = ({ id, config }) => {
  const entries = Object.entries(config).filter(
    // eslint-disable-next-line no-unused-vars
    ([_, cfg]) => cfg.theme || cfg.color
  );
  if (!entries.length) return null;

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const rules = entries
        .map(([key, itemConfig]) => {
          const color = itemConfig.theme?.[theme] ?? itemConfig.color;
          return color ? `  --color-${key}: ${color};` : "";
        })
        .filter(Boolean)
        .join("\n");
      return `${prefix} [data-chart=${id}] {\n${rules}\n}`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
};

export const ChartTooltip = RechartsPrimitive.Tooltip;

export const ChartTooltipContent = forwardRef(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
      ...props
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = useMemo(() => {
      if (hideLabel || !payload?.length) return null;
      const item = payload[0];
      let key = labelKey || item.dataKey || item.name || "value";
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      let value =
        !labelKey && typeof label === "string"
          ? config[label]?.label || label
          : itemConfig?.label;
      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }
      return value ? (
        <div className={cn("font-medium", labelClassName)}>{value}</div>
      ) : null;
    }, [
      hideLabel,
      label,
      labelFormatter,
      labelClassName,
      payload,
      config,
      labelKey,
    ]);

    if (!active || !payload?.length) return null;

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
        {...props}
      >
        {!nestLabel && tooltipLabel}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = nameKey || item.name || item.dataKey || "value";
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color ?? item.payload.fill ?? item.color;
            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item.value != null && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideLabel && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={{
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          }}
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel && tooltipLabel}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value != null && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltip";

export const ChartLegend = RechartsPrimitive.Legend;

export const ChartLegendContent = forwardRef(
  (
    {
      className,
      hideIcon = false,
      payload,
      verticalAlign = "bottom",
      nameKey,
      ...props
    },
    ref
  ) => {
    const { config } = useChart();
    if (!payload?.length) return null;
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
        {...props}
      >
        {payload.map((item) => {
          const key = nameKey || item.dataKey || "value";
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          return (
            <div
              key={item.value}
              className="flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegend";

function getPayloadConfigFromPayload(config, payload, key) {
  if (typeof payload !== "object" || payload == null) return undefined;
  const inner =
    payload.payload && typeof payload.payload === "object"
      ? payload.payload
      : {};
  let configKey = key;
  if (key in payload && typeof payload[key] === "string") {
    configKey = payload[key];
  } else if (inner && key in inner && typeof inner[key] === "string") {
    configKey = inner[key];
  }
  return config[configKey] || config[key];
}
