import React from 'react';
import { Button } from './ui/Button';

export const DiscardChangesPopup: React.FC<{ onConfirm: () => void, onCancel: () => void }> = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Discard Changes?</h3>
            <div className="flex gap-4 mt-6">
                 <Button variant="secondary" fullWidth onClick={onCancel}>No</Button>
                 <Button variant="danger" fullWidth onClick={onConfirm}>Yes</Button>
            </div>
        </div>
    </div>
);

export const ReEnterNumberPopup: React.FC<{ onConfirm: () => void, onCancel: () => void, isEmail?: boolean }> = ({ onConfirm, onCancel, isEmail }) => (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
                {isEmail ? "Do you want to Re-enter email?" : "Do you want to Re-enter mobile number?"}
            </h3>
            <div className="flex flex-col gap-3">
                 <Button fullWidth onClick={onConfirm}>Yes</Button>
                 <button onClick={onCancel} className="text-slate-500 font-medium py-2">Cancel</button>
            </div>
        </div>
    </div>
);

export const SkipMedicalPopup: React.FC<{ onFillNow: () => void, onFillLater: () => void }> = ({ onFillNow, onFillLater }) => (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
             <h3 className="text-lg font-bold text-slate-900 mb-2">We highly recommend, filling up the medical history for higher confident advice</h3>
             <p className="text-slate-500 text-sm mb-6">Your data is safe with us</p>
            <div className="flex flex-col gap-3">
                 <Button variant="outline" fullWidth onClick={onFillNow}>Fill-up now</Button>
                 <button onClick={onFillLater} className="bg-orange-100 text-orange-400 font-bold py-3.5 rounded-xl w-full">I will fill-up later</button>
            </div>
        </div>
    </div>
);