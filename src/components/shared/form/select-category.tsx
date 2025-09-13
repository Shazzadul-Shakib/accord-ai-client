// "use client";

// import * as select from "@/components/ui/select";
// import * as customForm from "@/components/ui/form";

// import { ICategory } from "@/lib/types";
// import { useQuery } from "@apollo/client";
// import { GET_CATEGORIES } from "@/lib/query";
// import { useSession } from "next-auth/react";

// interface IProps {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   form: any;
//   name: string;
//   label: string;
//   placeholder: string;
//   defaultValue?: string;
// }

// export const SelectCategory = ({
//   form,
//   name,
//   label,
//   placeholder,
//   defaultValue,
// }: IProps) => {
//   const { data: userInfo } = useSession();
//   const { data, loading } = useQuery(GET_CATEGORIES, {
//     variables: { userEmail: userInfo?.user?.email },
//   });

//   const categories = data?.categories as ICategory[];

//   return (
//     <customForm.FormField
//       control={form.control}
//       name={name}
//       render={({ field }) => (
//         <customForm.FormItem>
//           <customForm.FormLabel className="font-semibold">
//             {label}
//           </customForm.FormLabel>
//           <select.Select
//             onValueChange={field.onChange}
//             defaultValue={field.value || defaultValue}
//           >
//             <customForm.FormControl>
//               <select.SelectTrigger>
//                 <select.SelectValue
//                   placeholder={loading ? "Wait..." : placeholder}
//                 />
//               </select.SelectTrigger>
//             </customForm.FormControl>
//             <select.SelectContent>
//               {categories?.map((category) => (
//                 <select.SelectItem key={category.id} value={category.id}>
//                   {category.name}
//                 </select.SelectItem>
//               ))}
//               {!categories?.length && (
//                 <span className="p-1 text-sm">
//                   No category found, Create one
//                 </span>
//               )}
//             </select.SelectContent>
//           </select.Select>
//           <customForm.FormMessage />
//         </customForm.FormItem>
//       )}
//     />
//   );
// };

// For demo how to use