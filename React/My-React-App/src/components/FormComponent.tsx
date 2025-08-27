function FormComponent({ 
    label = 'Input Label', 
    type = 'text', 
    value = '', 
    onChange = () => { }, 
    required = false, 
    errorMessage = '' 
}: {
    label?: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    errorMessage?: string;
}) {
    return (
        <div className="space-y-2">
            <label 
                htmlFor="dynamicInput" 
                className="block text-sm font-semibold text-gray-700 mb-2"
            >
                {label}:
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input 
                id="dynamicInput" 
                type={type} 
                value={value} 
                onChange={onChange} 
                required={required}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white shadow-sm hover:border-gray-300"
                placeholder={`Enter your ${label.toLowerCase()}...`}
            />
            {errorMessage && (
                <div className="flex items-center mt-2">
                    <span className="text-red-500 text-sm">⚠️ {errorMessage}</span>
                </div>
            )}
        </div>
    )
}
export default FormComponent;