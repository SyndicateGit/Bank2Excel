import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

interface SelectBankOptionsProps {
  banks: string[];
  fileTypes: string[];
  handleBankChange: (value: string) => void;
  handleFileTypeChange: (value: string) => void;
}

const SelectBankOptions = ({banks, fileTypes, handleBankChange, handleFileTypeChange}: SelectBankOptionsProps) => {
  return (
    <>
      <Card>
          <CardHeader>
            <CardTitle>Select Your Bank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <Select onValueChange={handleBankChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose your bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={handleFileTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select supported file type" />
                </SelectTrigger>
                <SelectContent>
                  {fileTypes.map((filetype) => (
                    <SelectItem key={filetype} value={filetype}>
                      {filetype}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
    </>
  )
}

export default SelectBankOptions
