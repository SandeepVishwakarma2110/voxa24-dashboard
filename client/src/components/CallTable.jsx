 

// import React, { useState } from "react";

// const CallTable = ({ calls, username }) => {

//     const [selectedTranscript, setSelectedTranscript] = useState(null);

//     const formatDuration = (seconds) => {
//         if (!seconds) return "0s";

//         const mins = Math.floor(seconds / 60);
//         const secs = Math.floor(seconds % 60);

//         return `${mins}m ${secs}s`;
//     };

//     return (
//         <div className="bg-[#ffe6723f] shadow rounded-lg p-4">

//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Call Logs</h2>

//             <div className="overflow-x-auto">

//                 <table className="min-w-full border border-gray-800">

//                     <thead className="bg-[#e9df8e] text-gray-600 text-sm uppercase">
//                         <tr>
//                             <th className="p-2 border border-gray-800">Log ID</th>
//                             <th className="p-2 border border-gray-800">Customer</th>
//                             <th className="p-2 border border-gray-800">Number</th>
//                             <th className="p-2 border border-gray-800">Start Time</th>
//                             <th className="p-2 border border-gray-800">End Time</th>
//                             <th className="p-2 border border-gray-800">Duration</th>
//                             <th className="p-2 border border-gray-800">Transcript</th>
//                         </tr>
//                     </thead>

//                     <tbody>

//                         {calls.length === 0 ? (
//                             <tr>
//                                 <td colSpan="7" className="text-center p-4">
//                                     No calls found
//                                 </td>
//                             </tr>
//                         ) : (
//                             calls.map((call) => (

//                                 <tr key={call.id} className="hover:bg-[#e9df8e] text-gray-800">

//                                     <td className="p-2 border border-gray-800 font-mono text-sm" title={call.id}>
//                                         {call.id}
//                                     </td>

//                                     <td className="p-2 border border-gray-800">
//                                         {call.customer?.name || "Unknown"}
//                                     </td>

//                                     <td className="p-2 border border-gray-800">
//                                         {call.customer?.number}
//                                     </td>

//                                     <td className="p-2 border border-gray-800">
//                                         {new Date(call.startedAt).toLocaleString()}
//                                     </td>

//                                     <td className="p-2 border border-gray-800">
//                                         {new Date(call.endedAt).toLocaleString()}
//                                     </td>

//                                     <td className="p-2 border border-gray-800">
//                                         {formatDuration(call.duration)}
//                                     </td>

//                                     <td className="p-2 border text-center border-gray-800">
//                                         <button
//                                             className="bg-[#e7a7a767] text-gray-800 px-3 py-1 rounded hover:scale-105 smooth-transition"
//                                             onClick={() => {
//                                                 console.log(call.transcript);
//                                                 setSelectedTranscript({
//                                                     messages: call.transcript,
//                                                     customerName: call.customer?.name || "Unknown"
//                                                 });
//                                             }}
//                                         >
//                                             View
//                                         </button>
//                                     </td>

//                                 </tr>

//                             ))
//                         )}

//                     </tbody>

//                 </table>

//             </div>

//             {selectedTranscript && (

//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

//                     <div className="bg-[#eccd79] rounded-lg w-2/3 max-h-[80vh] flex flex-col shadow-xl">

//                         {/* Header */}
//                         <div className="flex justify-between items-center p-4 border-b">
//                             <h3 className="text-lg font-semibold text-gray-800">Transcript</h3>
//                             <button
//                                 className="text-gray-800 font-semibold"
//                                 onClick={() => setSelectedTranscript(null)}
//                             >
//                                 Close
//                             </button>
//                         </div>

//                         {/* Chat Body */}
//                         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar">

//                             {Array.isArray(selectedTranscript.messages) ? (

//                                 selectedTranscript.messages.map((entry, idx) => {

//                                     const isUser = entry.role === "user";

//                                     return (
//                                         <div
//                                             key={idx}
//                                             className={`flex ${isUser ? "justify-end" : "justify-start"}`}
//                                         >
//                                             <div
//                                                 className={`max-w-[70%] px-4 py-2 rounded-lg text-sm shadow
//                                                     ${isUser
//                                                         ? "bg-[#e7a7a767] text-gray-800"
//                                                         : "bg-[#e9df8e] text-gray-800"
//                                                     }`}
//                                             >
//                                                 <div className="text-xs font-semibold mb-1">
//                                                     {isUser ? selectedTranscript.customerName : "Agent"}
//                                                 </div>
//                                                 <div>{entry.message}</div>
//                                             </div>
//                                         </div>
//                                     );
//                                 })

//                             ) : (
//                                 <div className="text-center text-gray-500">
//                                     No transcript available
//                                 </div>
//                             )}

//                         </div>

//                     </div>

//                 </div>

//             )}

//         </div>
//     );
// };

// export default CallTable;
import React, { useState } from "react";

const CallTable = ({ calls, username }) => {

    const [selectedTranscript, setSelectedTranscript] = useState(null);

    const formatDuration = (seconds) => {
        if (!seconds) return "0s";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}m ${secs}s`;
    };

    // Use UTC to match chart (chart uses toISOString which is UTC)
    const formatUTCDateTime = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        const day = String(d.getUTCDate()).padStart(2, "0");
        const month = String(d.getUTCMonth() + 1).padStart(2, "0");
        const year = d.getUTCFullYear();
        const rawHours = d.getUTCHours();
        const minutes = String(d.getUTCMinutes()).padStart(2, "0");
        const seconds = String(d.getUTCSeconds()).padStart(2, "0");
        const ampm = rawHours >= 12 ? "pm" : "am";
        const displayHour = String(rawHours % 12 || 12).padStart(2, "0");
        return `${day}/${month}/${year} ${displayHour}:${minutes}:${seconds} ${ampm}`;
    };

    return (
        <div className="bg-[#ffe6723f] shadow rounded-lg p-4">

            <h2 className="text-xl font-semibold mb-4 text-gray-800">Call Logs</h2>

            <div className="overflow-x-auto">

                <table className="min-w-full border border-gray-800">

                    <thead className="bg-[#e9df8e] text-gray-600 text-sm uppercase">
                        <tr>
                            <th className="p-2 border border-gray-800">Log ID</th>
                            <th className="p-2 border border-gray-800">Customer</th>
                            <th className="p-2 border border-gray-800">Number</th>
                            <th className="p-2 border border-gray-800">Start Time</th>
                            <th className="p-2 border border-gray-800">End Time</th>
                            <th className="p-2 border border-gray-800">Duration</th>
                            <th className="p-2 border border-gray-800">Transcript</th>
                        </tr>
                    </thead>

                    <tbody>

                        {calls.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center p-4">
                                    No calls found
                                </td>
                            </tr>
                        ) : (
                            calls.map((call) => (

                                <tr key={call.id} className="hover:bg-[#e9df8e] text-gray-800">

                                    <td className="p-2 border border-gray-800 font-mono text-sm" title={call.id}>
                                        {call.id}
                                    </td>

                                    <td className="p-2 border border-gray-800">
                                        {call.customer?.name || "Unknown"}
                                    </td>

                                    <td className="p-2 border border-gray-800">
                                        {call.customer?.number}
                                    </td>

                                    <td className="p-2 border border-gray-800">
                                        {formatUTCDateTime(call.startedAt)}
                                    </td>

                                    <td className="p-2 border border-gray-800">
                                        {formatUTCDateTime(call.endedAt)}
                                    </td>

                                    <td className="p-2 border border-gray-800">
                                        {formatDuration(call.duration)}
                                    </td>

                                    <td className="p-2 border text-center border-gray-800">
                                        <button
                                            className="bg-[#e7a7a767] text-gray-800 px-3 py-1 rounded hover:scale-105 smooth-transition"
                                            onClick={() => {
                                                console.log(call.transcript);
                                                setSelectedTranscript({
                                                    messages: call.transcript,
                                                    customerName: call.customer?.name || "Unknown"
                                                });
                                            }}
                                        >
                                            View
                                        </button>
                                    </td>

                                </tr>

                            ))
                        )}

                    </tbody>

                </table>

            </div>

            {selectedTranscript && (

                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                    <div className="bg-[#eccd79] rounded-lg w-2/3 max-h-[80vh] flex flex-col shadow-xl">

                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">Transcript</h3>
                            <button
                                className="text-gray-800 font-semibold"
                                onClick={() => setSelectedTranscript(null)}
                            >
                                Close
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar">

                            {Array.isArray(selectedTranscript.messages) ? (

                                selectedTranscript.messages.map((entry, idx) => {

                                    const isUser = entry.role === "user";

                                    return (
                                        <div
                                            key={idx}
                                            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[70%] px-4 py-2 rounded-lg text-sm shadow
                                                    ${isUser
                                                        ? "bg-[#e7a7a767] text-gray-800"
                                                        : "bg-[#e9df8e] text-gray-800"
                                                    }`}
                                            >
                                                <div className="text-xs font-semibold mb-1">
                                                    {isUser ? selectedTranscript.customerName : "Bot"}
                                                </div>
                                                <div>{entry.message}</div>
                                            </div>
                                        </div>
                                    );
                                })

                            ) : (
                                <div className="text-center text-gray-500">
                                    No transcript available
                                </div>
                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default CallTable;