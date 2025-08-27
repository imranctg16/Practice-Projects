import { useState } from "react";

interface Field {
    id: number;
    type: string;
    label: string;
    value: string;
    required: boolean;
}

function FormBuilder() {
    const [fields, setFields] = useState<Field[]>([]);

    const addField = (type: string, label: string) => {
        const newField: Field = {
            id: Date.now(),
            type,
            label,
            value: '',
            required: true
        };
        setFields([...fields, newField]);
    };

    const removeField = (id: number) => {
        setFields(fields.filter(field => field.id !== id));
    };

    const clearAll = () => {
        setFields([]);
    };

    const fieldTypes = [
        { type: 'text', label: 'Text Field', icon: '📝', color: 'from-blue-500 to-cyan-500' },
        { type: 'number', label: 'Number Field', icon: '🔢', color: 'from-green-500 to-teal-500' },
        { type: 'email', label: 'Email Field', icon: '📧', color: 'from-purple-500 to-pink-500' },
        { type: 'password', label: 'Password Field', icon: '🔒', color: 'from-red-500 to-orange-500' },
        { type: 'tel', label: 'Phone Field', icon: '📱', color: 'from-indigo-500 to-blue-500' },
        { type: 'date', label: 'Date Field', icon: '📅', color: 'from-yellow-500 to-orange-500' }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Dynamic Form Builder</h3>
                <p className="text-gray-600">Click buttons below to add different input types to your form</p>
            </div>

            {/* Action Buttons */}
            <div className="mb-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {fieldTypes.map((fieldType) => (
                        <button
                            key={fieldType.type}
                            onClick={() => addField(fieldType.type, fieldType.label)}
                            className={`bg-gradient-to-r ${fieldType.color} hover:scale-105 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center space-x-2`}
                        >
                            <span className="text-lg">{fieldType.icon}</span>
                            <span>Add {fieldType.label}</span>
                        </button>
                    ))}
                </div>
                
                {fields.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center space-x-2"
                    >
                        <span>🗑️</span>
                        <span>Clear All Fields</span>
                    </button>
                )}
            </div>

            {/* Form Preview */}
            {fields.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">Form Preview</h3>
                        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {fields.length} field{fields.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                    
                    <form className="space-y-6">
                        {fields.map((field, index) => (
                            <div key={field.id} className="group relative">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            {field.label} #{index + 1}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        <input
                                            type={field.type}
                                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                                            required={field.required}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white shadow-sm hover:border-gray-300"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeField(field.id)}
                                        className="mt-8 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                        title="Remove field"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        <div className="pt-6 border-t border-gray-200">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center space-x-2"
                            >
                                <span>🚀</span>
                                <span>Submit Form</span>
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No fields added yet</h3>
                    <p className="text-gray-500">Start building your form by clicking the buttons above</p>
                </div>
            )}
        </div>
    );
}
export default FormBuilder;