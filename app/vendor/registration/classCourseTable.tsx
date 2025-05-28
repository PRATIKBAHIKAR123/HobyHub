import { ClassCourseTableProps, ClassCourseItem } from '@/types/classCourse';
import { toast } from "sonner";

export default function ClassCourseTable({ items, onEdit, onDelete, onCopy }: ClassCourseTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timings</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Range</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item: ClassCourseItem, index: number) => (
            <tr key={`${item.className}-${index}`}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.className}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.timingsFrom} - {item.timingsTo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.fromage} - {item.toage} years
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{item.fromcost} - ₹{item.tocost}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location?.address}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location?.city}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.contact ? `${item.contact.tutorFirstName} ${item.contact.tutorLastName}` : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(index)}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center cursor-pointer"
                  >
                    <img src="/Icons/edit.png" alt="Edit Icon" className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onCopy(index);
                      toast.success("Class details copied successfully!");
                    }}
                    className="text-blue-600 hover:text-blue-900 flex items-center cursor-pointer"
                  >
                    <img src="/Icons/copy.png" alt="Copy Icon" className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDelete(index)}
                    className="text-red-600 hover:text-red-900 flex items-center cursor-pointer"
                  >
                    <img src="/Icons/bin.png" alt="Delete Icon" className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center py-4">
                No items added yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 