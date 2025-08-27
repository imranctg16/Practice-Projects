function BusinessCard({ 
    name, 
    title, 
    company, 
    email, 
    phone 
}: {
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
}) {
    return (
        <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:scale-105">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-t-2xl"></div>
            
            {/* Profile Avatar */}
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                    {name.charAt(0)}
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                        {name}
                    </h2>
                    <p className="text-sm text-gray-500">Professional Contact</p>
                </div>
            </div>

            {/* Job Info */}
            <div className="mb-4 space-y-2">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-100">
                    <p className="text-blue-800 font-semibold text-sm">{title}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-2 rounded-lg border border-purple-100">
                    <p className="text-purple-800 font-semibold text-sm">{company}</p>
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center group/email hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600 text-sm">📧</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                        <p className="text-sm text-gray-700 font-medium">{email}</p>
                    </div>
                </div>
                
                <div className="flex items-center group/phone hover:bg-green-50 p-2 rounded-lg transition-colors duration-200">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-green-600 text-sm">📱</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                        <p className="text-sm text-gray-700 font-medium">{phone}</p>
                    </div>
                </div>
            </div>

            {/* Hover Effect Indicator */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">→</span>
                </div>
            </div>
        </div>
    );
}

export default BusinessCard;