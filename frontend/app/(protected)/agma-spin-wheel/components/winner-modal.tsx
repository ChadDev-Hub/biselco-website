"use client";
import { X, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { GetWinnerInfo, DismissedWinner, UpdateWinnerStatus } from '../../../actions/agma';
import { WinnerInfoType } from "../../../../types/agma";
import InfoCard from "./infoCard";
import { useAlert } from '../../../common/alert';
type Props = {
  winner_account: string;
  showModal: (bolean: boolean) => void;
  removeWinerEntry: (account_no: string) => void;
};

const WinnerModal = ({
  winner_account,
  showModal,
  removeWinerEntry,
}: Props) => {
  const {showAlert} = useAlert()
  const [winnerInfo, setWinnerInfo] = useState<WinnerInfoType | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  useEffect(() => {
    const getInfo = async () => {
      const res = await GetWinnerInfo(winner_account);
      setWinnerInfo(res?.data);
    };
    getInfo();
  }, [winner_account]);
  const handleClose = () => {
    showModal(false);
    setWinnerInfo(null);
  };
  const handleSaveWinner = async () => {
    if (!winnerInfo) return;
    setIsUpdating(true);
    const res = await UpdateWinnerStatus(winnerInfo.id);
    if (res?.status === 200) {
      setIsUpdating(false);
      removeWinerEntry(winnerInfo.account_no);
      showAlert("success", "Winner Save Successfully");
    }
    showModal(false);
  };

  const handleDismissedWinner = async () => {
    if (!winnerInfo) return;
    setIsDismissing(true);
    const res = await DismissedWinner(winnerInfo.id);
    if (res?.status === 200) {
      setIsDismissing(false);
      removeWinerEntry(winnerInfo.account_no);
      showAlert("success", "Winner Dismissed Successfully");
    }
    showModal(false);
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
      <Confetti />
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative transform transition-all duration-300 scale-100 animate-in zoom-in-95">
        {/* Close Cross icon corner button */}
        <button
          type="button"
          title="close modal"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Glowing Trophy Icon Ring */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20 mb-5 transform rotate-3">
          <Trophy className="size-10 stroke-[2.5]" />
        </div>

        <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
          Draw Completed
        </span>

        <h2 className="text-3xl font-black text-white mt-1 mb-4 tracking-tight">
          {winner_account}
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Congratulations! This account has won the draw.
        </p>
        {winnerInfo && <InfoCard data={winnerInfo} />}
        {/* Modal Actions */}
        <div className="flex flex-col gap-2">
          <button
            disabled={isUpdating}
            type="button"
            onClick={handleSaveWinner}
            className="w-full py-3.5 bg-linear-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-950/50"
          >
            {isUpdating ? <span className="skeleton skeleton-text">Saving Winner...</span> : "Confirm Reward"}
          </button>
          <button
            disabled={isDismissing}
            type="button"
            onClick={handleDismissedWinner}
            className="w-full py-2.5 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white font-semibold rounded-xl transition-all text-sm"
          >
            {isDismissing ? <span className="skeleton skeleton-text">Dismissing Winner...</span> : "Dismiss Winner"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
