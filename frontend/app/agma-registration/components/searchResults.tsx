"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useAuth } from "@/app/utils/authProvider";
import { queryConsumer } from "../../../lib/consumer-meter";
import { Consumer } from "@/types/consumer-meter";
import { UseFormSetValue } from "react-hook-form";
import { FormType } from "@/types/agma";

type Props = {
  input: string;
  setValue?: UseFormSetValue<FormType>;
};

const SearchResults = ({ input, setValue }: Props) => {
  const { user } = useAuth();
  const [results, setResults] = useState<Consumer[] | []>([]);
  const [debounceValue] = useDebounce(input, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState<string>("");
  const listClassName =
    "hover:bg-base-300  cursor-pointer border border-slate-300 border-dashed text-xs z-50";
  useEffect(() => {
    if (!user) return;
    if (!user.roles.map((r) => r.name).includes("admin")) return;
    if (debounceValue === selectedConsumer){
      queueMicrotask(() => setIsLoading(false));
      queueMicrotask(() => setResults([]));
      return
    }
    if (!debounceValue) {
      queueMicrotask(() => setIsLoading(false));
      queueMicrotask(() => setResults([]));
      if (setValue) setValue("name", "");
      return;
    }

    let isCancelled = false;

    const fetchData = async () => {
      setIsLoading(true);

      const res = await queryConsumer(debounceValue);

      if (isCancelled) return;
      if (res.status === 200) {
        setResults(res.data);
      }

      setIsLoading(false);
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [debounceValue, user, setValue, selectedConsumer]);

  if (isLoading)
    return <div className={`${listClassName} w-full`}>Loading...</div>;

  const handleSection = (account_no: string, account_name: string) => {
    if (setValue) {
      setSelectedConsumer(account_no);
      setValue("account_no", account_no);
      setValue("name", account_name);
    }
    setResults([]);
  };
  return (
    <>
      {results.length > 0 ? (
        <ul className="absolute max-h-96 overflow-y-scroll  w-full  p-2 shadow bg-base-100 rounded-box z-50">
          {results.map((consumer: Consumer, index: number) => (
            <li
              onClick={() => {
                handleSection(consumer.account_no, consumer.account_name);
              }}
              className={listClassName}
              key={index}
            >
              <span>
                {consumer.account_no} | {consumer.account_name} |{" "}
                {consumer.village}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default SearchResults;
