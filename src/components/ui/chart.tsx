      "use client"
      
      import * as React from "react"
      import * as RechartsPrimitive from "recharts"
      
      import { cn } from "@/lib/utils"
      
      // Format: { THEME_NAME: CSS_SELECTOR }
      const THEMES = { light: "", dark: ".dark" } as const
     
      export type ChartConfig = {
        [k in string]: {
          label?: React.ReactNode
          icon?: React.ComponentType
        } & (
          | { color?: string; theme?: never }
          | { color?: never; theme: Record<keyof typeof THEMES, string> }
        )
      }
     
      type ChartContextProps = {
        config: ChartConfig
      }
     
      const ChartContext = React.createContext<ChartContextProps | null>(null)
     
      function useChart() {
        const context = React.useContext(ChartContext)
     
        if (!context) {
          throw new Error("useChart must be used within a <ChartContainer />")
        }
     
        return context
      }
     
      const ChartContainer = React.forwardRef<
        HTMLDivElement,
        React.HTMLAttributes<HTMLDivElement> & {
          config: ChartConfig
          children: React.ReactNode
        }
      >(({ className, config, children, ...props }, ref) => {
        return (
          <ChartContext.Provider value={{ config }}>
            <div ref={ref} className={cn("w-full", className)} {...props}>
              <RechartsPrimitive.ResponsiveContainer width="100%" height={320}>
                {children}
              </RechartsPrimitive.ResponsiveContainer>
            </div>
          </ChartContext.Provider>
        )
      })
      ChartContainer.displayName = "Chart"
     
      const ChartLegend = RechartsPrimitive.Legend
     
      interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
        // Directly using the types from recharts to avoid type conflicts.
        payload?: any[];
        verticalAlign?: "top" | "middle" | "bottom" | undefined;
        hideIcon?: boolean;
        nameKey?: string;
      }
     
      const ChartLegendContent = React.forwardRef<
        HTMLDivElement,
        ChartLegendContentProps
      >(
        (
          { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
          ref
        ) => {
          const { config } = useChart()
     
          if (!payload?.length) {
            return null
          }
     
          return (
            <div
              ref={ref}
              className={cn(
                "flex items-center justify-center gap-4",
                verticalAlign === "top" ? "pb-3" : "pt-3",
                className
              )}
            >
              {payload.map((item: any) => {
                const key = `${nameKey || item.dataKey || "value"}`
                const itemConfig = getPayloadConfigFromPayload(config, item, key)
     
                if (!itemConfig) {
                  return null
                }
     
                const color = itemConfig?.theme ? itemConfig.theme : itemConfig?.color
     
                return (
                  <div key={item.value} className="flex items-center gap-1.5">
                    {!hideIcon && (
                      <RechartsPrimitive.Legend
                        align="left"
                        verticalAlign="middle"
                        height={24}
                        width={24}
                        payload={[
                          {
                            value: item.value,
                            type: "square",
                            color: color?.light,
                          },
                        ]}
                        formatter={() => <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color?.light }} />}
                      />
                    )}
                    {itemConfig?.label || item.value}
                  </div>
                )
              })}
            </div>
          )
        }
      )
      ChartLegendContent.displayName = "ChartLegendContent"
     
      function getPayloadConfigFromPayload(config: ChartConfig, payload: any, key: string) {
        const configKey = Object.keys(config).find((k) => {
          if (k.includes("*")) {
            const regex = new RegExp(`^${k.replace("*", ".*")}$`)
            return regex.test(key)
          }
          return k === key
        })
        return configKey ? config[configKey] : null
      }
     
      export { ChartContainer, ChartLegend, ChartLegendContent }