
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { DiscardChangesPopup } from './Popups';
import { DEFAULT_PROFILE_IMAGE } from '../constants';

interface EditProfileProps {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
  onCancel: () => void;
}

// Validation Helpers (Reused logic)
const validatePhone = (phone: string) => /^\+?[\d\s-]{6,}$/.test(phone);
const validateBP = (bp: string) => /^\d{2,3}\/\d{2,3}$/.test(bp);

export const EditProfile: React.FC<EditProfileProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDiscardPopup, setShowDiscardPopup] = useState(false);
  const [allergyInput, setAllergyInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For local preview in Edit mode, we can use createObjectURL. 
      // If we wanted to save this to Firestore, we'd need to convert to Base64 in handleSave 
      // or here. For consistency with AuthFlow, let's use Base64 here too.
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Allergy Logic
  const handleAddAllergy = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const trimmed = allergyInput.trim();
        if (trimmed && !formData.allergies.includes(trimmed)) {
            setFormData({
                ...formData,
                allergies: [...formData.allergies, trimmed]
            });
            setAllergyInput("");
        }
    }
  };

  const handleRemoveAllergy = (index: number) => {
      const newAllergies = [...formData.allergies];
      newAllergies.splice(index, 1);
      setFormData({ ...formData, allergies: newAllergies });
  };

  const handleCancel = () => {
      setShowDiscardPopup(true);
  };

  const handleConfirmDiscard = () => {
      setShowDiscardPopup(false);
      onCancel();
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      const newErrors: Record<string, string> = {};

      if (!formData.name?.trim()) newErrors.name = "Name is required";
      if (formData.phone && !validatePhone(formData.phone)) newErrors.phone = "Invalid phone number";
      if (!formData.dob) newErrors.dob = "Date of Birth is required";
      
      if (formData.height && (isNaN(Number(formData.height)) || Number(formData.height) < 50 || Number(formData.height) > 300)) {
          newErrors.height = "Invalid height";
      }
      if (formData.weight && (isNaN(Number(formData.weight)) || Number(formData.weight) < 2 || Number(formData.weight) > 500)) {
          newErrors.weight = "Invalid weight";
      }
      if (formData.bloodPressure && !validateBP(formData.bloodPressure)) {
          newErrors.bloodPressure = "Invalid format (e.g. 120/80)";
      }

      if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
      }
      
      onSave(formData);
  };

  return (
    <>
      {showDiscardPopup && <DiscardChangesPopup onConfirm={handleConfirmDiscard} onCancel={() => setShowDiscardPopup(false)} />}
      <div className="flex flex-col h-full bg-white">
        <div className="p-4 border-b flex items-center sticky top-0 bg-white z-10">
            <button onClick={handleCancel}><svg className="w-6 h-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
            <h1 className="ml-4 text-lg font-bold text-slate-900">Edit Profile</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {/* Photo Upload */}
             <div className="flex justify-center mb-2">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />
                <div 
                    onClick={handlePhotoClick}
                    className="w-24 h-24 rounded-full flex items-center justify-center relative cursor-pointer group"
                >
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-200">
                        <img 
                            src={formData.photoUrl || DEFAULT_PROFILE_IMAGE} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-md border-2 border-white">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                </div>
            </div>

            <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 border-b pb-2">Personal Information</h3>
                    <Input name="name" label="Name" value={formData.name} onChange={handleChange} error={errors.name} />
                    <Input name="phone" type="tel" label="Phone" value={formData.phone} onChange={handleChange} error={errors.phone} />
                    <Input name="email" type="email" label="Email" value={formData.email} onChange={handleChange} disabled className="bg-slate-50 text-slate-500" />
                    <Input name="dob" type="date" label="Date of Birth" value={formData.dob} onChange={handleChange} error={errors.dob} />
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Gender</label>
                        <div className="flex gap-2">
                            {['Male', 'Female', 'Other'].map(g => (
                                <button 
                                    key={g}
                                    type="button"
                                    onClick={() => setFormData({...formData, gender: g as any})}
                                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-colors ${formData.gender === g ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'}`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 border-b pb-2">Medical Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Height (cm)" type="number" name="height" value={formData.height} onChange={handleChange} error={errors.height} />
                        <Input label="Weight (kg)" type="number" name="weight" value={formData.weight} onChange={handleChange} error={errors.weight} />
                    </div>
                    
                    <Input 
                        label="Blood group" 
                        name="bloodGroup" 
                        type="select"
                        value={formData.bloodGroup} 
                        onChange={handleChange}
                        options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                    />
                    
                    <Input label="Blood pressure" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} error={errors.bloodPressure} />
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Allergies</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.allergies.map((a: string, idx) => (
                                <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 group">
                                    {a}
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveAllergy(idx)}
                                        className="text-blue-400 hover:text-red-500 transition-colors"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </span>
                            ))}
                        </div>
                        <Input 
                            placeholder="Type allergy and press Enter" 
                            value={allergyInput}
                            onChange={(e) => setAllergyInput(e.target.value)}
                            onKeyDown={handleAddAllergy}
                        />
                    </div>
                </div>
            </form>
        </div>

        <div className="p-4 border-t flex gap-3 bg-white">
            <Button variant="secondary" fullWidth onClick={handleCancel}>Cancel</Button>
            <Button type="submit" form="edit-profile-form" fullWidth>Save Changes</Button>
        </div>
      </div>
    </>
  );
};
