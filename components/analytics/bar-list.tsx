"use client";

import { useMediaQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useMemo, useState } from "react";

export function BarList({
  data,
  barBackground,
  hoverBackground,
  maxValue,
  setShowModal,
  limit,
}: {
  data: {
    icon: ReactNode;
    title: string;
    value: number;
  }[];
  maxValue: number;
  barBackground: string;
  hoverBackground: string;
  setShowModal?: (show: boolean) => void;
  limit?: number;
}) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (limit) {
      return data.slice(0, limit);
    } else {
      return search
        ? data.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()))
        : data;
    }
  }, [data, limit, search]);

  const { isMobile } = useMediaQuery();

  const bars = (
    <div className="grid">
      {filteredData.map((data, idx) => (
        <LineItem
          key={idx}
          {...data}
          maxValue={maxValue}
          setShowModal={setShowModal}
          barBackground={barBackground}
          hoverBackground={hoverBackground}
        />
      ))}
    </div>
  );

  if (limit) {
    return bars;
  } else {
    return (
      <>
        <div className="relative px-4 py-3">
          <div className="pointer-events-none absolute inset-y-0 left-7 flex items-center">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            autoFocus={!isMobile}
            className="w-full rounded-md border border-gray-300 py-2 pl-10 text-black placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-200 sm:text-sm"
            placeholder={`搜索...`}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="h-[50vh] overflow-auto pb-4 md:h-[40vh]">{bars}</div>
      </>
    );
  }
}

export function LineItem({
  icon,
  title,
  value,
  maxValue,
  setShowModal,
  barBackground,
  hoverBackground,
}: {
  icon: ReactNode;
  title: string;
  value: number;
  maxValue: number;
  setShowModal?: (show: boolean) => void;
  barBackground: string;
  hoverBackground: string;
}) {
  const lineItem = useMemo(() => {
    return (
      <div className="z-10 flex items-center space-x-4 overflow-hidden px-3">
        {icon}
        <div className="truncate text-gray-800 text-sm">{title}</div>
      </div>
    );
  }, [icon, title]);

  return (
    <Link
      href={""}
      scroll={false}
      onClick={() => setShowModal?.(false)}
      className={`border-transparent border-l-2 px-4 py-1 ${hoverBackground} min-w-0 cursor-default transition-all`}
    >
      <div className="group flex items-center justify-between">
        <div className="relative z-10 flex h-8 w-full min-w-0 max-w-[calc(100%-2rem)] items-center">
          {lineItem}
          <motion.div
            style={{
              width: `${(value / (maxValue || 0)) * 100}%`,
            }}
            className={cn("absolute h-full origin-left rounded-md", barBackground)}
            transition={{ ease: "easeOut", duration: 0.3 }}
            initial={{ transform: "scaleX(0)" }}
            animate={{ transform: "scaleX(1)" }}
          />
        </div>
        <p className="z-10 px-2 text-gray-600 text-sm">{value}</p>
      </div>
    </Link>
  );
}
