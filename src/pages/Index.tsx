import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LicenseCard } from "@/components/LicenseCard";
import { AddLicenseDialog } from "@/components/AddLicenseDialog";
import { StatsCards } from "@/components/StatsCards";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface License {
  id: string;
  name: string;
  email: string;
  key: string;
  users: User[];
  maxUsers: number;
}

const Index = () => {
  const [licenses, setLicenses] = useState<License[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const addLicense = (license: Omit<License, "id">) => {
    const newLicense: License = {
      ...license,
      id: Date.now().toString(),
    };
    setLicenses([...licenses, newLicense]);
  };

  const updateLicense = (licenseId: string, updatedLicense: License) => {
    setLicenses(licenses.map(l => l.id === licenseId ? updatedLicense : l));
  };

  const deleteLicense = (licenseId: string) => {
    setLicenses(licenses.filter(l => l.id !== licenseId));
  };

  const totalLicenses = licenses.length;
  const totalUsers = licenses.reduce((acc, l) => acc + l.users.length, 0);
  const availableSlots = licenses.reduce((acc, l) => acc + (l.maxUsers - l.users.length), 0);
  const usagePercentage = totalLicenses > 0 
    ? Math.round((totalUsers / (totalLicenses * 5)) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Gerenciamento Office 365
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Controle de licenças e usuários
              </p>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Licença
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards 
          totalLicenses={totalLicenses}
          totalUsers={totalUsers}
          availableSlots={availableSlots}
          usagePercentage={usagePercentage}
        />

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Licenças Ativas
          </h2>
          
          {licenses.length === 0 ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Nenhuma licença cadastrada ainda
              </p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar primeira licença
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {licenses.map((license) => (
                <LicenseCard
                  key={license.id}
                  license={license}
                  onUpdate={updateLicense}
                  onDelete={deleteLicense}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AddLicenseDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={addLicense}
      />
    </div>
  );
};

export default Index;
