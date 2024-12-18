import { useLineAccounts } from '@/app/hooks/useLineAccounts';
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from '../ui/select';

interface AccountSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function AccountSelect({ value, onChange }: AccountSelectProps) {
  const { accounts, isLoading } = useLineAccounts();

  if (isLoading) {
    return (
      <div className="h-11 w-full animate-pulse rounded-lg bg-slate-100" />
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="เลือก LINE Account" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>LINE Official Accounts</SelectLabel>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}