
import { useState } from 'react';
import { useMemberData } from '@/context/MemberDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, X, Plus, Download, Upload, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Member } from '@/data/memberData';

const MemberManagement = () => {
  const { members, roles, awards, setMembers, setRoles, setAwards, resetToDefaults, exportData, importData } = useMemberData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  // Members state
  const [newMemberName, setNewMemberName] = useState('');
  const [editingMembers, setEditingMembers] = useState<Member[]>([]);
  
  // Roles state
  const [newRole, setNewRole] = useState('');
  const [editingRoles, setEditingRoles] = useState<string[]>([]);
  
  // Awards state
  const [newAward, setNewAward] = useState('');
  const [editingAwards, setEditingAwards] = useState<string[]>([]);
  
  // Import/Export state
  const [importText, setImportText] = useState('');

  const handleOpen = () => {
    setEditingMembers([...members]);
    setEditingRoles([...roles]);
    setEditingAwards([...awards]);
    setIsOpen(true);
  };

  // Member operations
  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember: Member = {
        id: Date.now().toString(),
        name: newMemberName.trim(),
      };
      setEditingMembers([...editingMembers, newMember]);
      setNewMemberName('');
    }
  };

  const handleDeleteMember = (id: string) => {
    setEditingMembers(editingMembers.filter(m => m.id !== id));
  };

  const handleUpdateMember = (id: string, name: string) => {
    setEditingMembers(editingMembers.map(m => 
      m.id === id ? { ...m, name } : m
    ));
  };

  // Role operations
  const handleAddRole = () => {
    if (newRole.trim() && !editingRoles.includes(newRole.trim())) {
      setEditingRoles([...editingRoles, newRole.trim()]);
      setNewRole('');
    }
  };

  const handleDeleteRole = (role: string) => {
    setEditingRoles(editingRoles.filter(r => r !== role));
  };

  const handleUpdateRole = (oldRole: string, newRole: string) => {
    setEditingRoles(editingRoles.map(r => r === oldRole ? newRole : r));
  };

  // Award operations
  const handleAddAward = () => {
    if (newAward.trim() && !editingAwards.includes(newAward.trim())) {
      setEditingAwards([...editingAwards, newAward.trim()]);
      setNewAward('');
    }
  };

  const handleDeleteAward = (award: string) => {
    setEditingAwards(editingAwards.filter(a => a !== award));
  };

  const handleUpdateAward = (oldAward: string, newAward: string) => {
    setEditingAwards(editingAwards.map(a => a === oldAward ? newAward : a));
  };

  // Save all changes
  const handleSave = () => {
    setMembers(editingMembers);
    setRoles(editingRoles);
    setAwards(editingAwards);
    setIsOpen(false);
    toast({
      title: "Changes saved",
      description: "All changes have been saved successfully.",
    });
  };

  // Export data
  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mtm-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Data exported",
      description: "Data has been exported successfully.",
    });
  };

  // Import data
  const handleImport = () => {
    if (importData(importText)) {
      setImportText('');
      setIsOpen(false);
      toast({
        title: "Data imported",
        description: "Data has been imported successfully.",
      });
      // Reload the page to reflect changes
      window.location.reload();
    } else {
      toast({
        title: "Import failed",
        description: "Invalid JSON format. Please check your data.",
        variant: "destructive",
      });
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
      resetToDefaults();
      setIsOpen(false);
      toast({
        title: "Data reset",
        description: "All data has been reset to defaults.",
      });
      // Reload the page to reflect changes
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={handleOpen}
          variant="outline" 
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Club Data</DialogTitle>
          <DialogDescription>
            Add, edit, or remove members, roles, and awards. Changes are saved locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="awards">Awards</TabsTrigger>
            <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="New member name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
              />
              <Button onClick={handleAddMember}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {editingMembers.map((member) => (
                <div key={member.id} className="flex gap-2 items-center">
                  <Input
                    value={member.name}
                    onChange={(e) => handleUpdateMember(member.id, e.target.value)}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">Total members: {editingMembers.length}</p>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="New role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRole()}
              />
              <Button onClick={handleAddRole}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {editingRoles.map((role, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={role}
                    onChange={(e) => handleUpdateRole(role, e.target.value)}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteRole(role)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">Total roles: {editingRoles.length}</p>
          </TabsContent>

          {/* Awards Tab */}
          <TabsContent value="awards" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="New award"
                value={newAward}
                onChange={(e) => setNewAward(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAward()}
              />
              <Button onClick={handleAddAward}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {editingAwards.map((award, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={award}
                    onChange={(e) => handleUpdateAward(award, e.target.value)}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteAward(award)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">Total awards: {editingAwards.length}</p>
          </TabsContent>

          {/* Import/Export Tab */}
          <TabsContent value="import-export" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Export Data</Label>
                <p className="text-sm text-gray-500 mb-2">Download your data as a JSON file</p>
                <Button onClick={handleExport} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
              
              <div>
                <Label>Import Data</Label>
                <p className="text-sm text-gray-500 mb-2">Paste JSON data to import</p>
                <Textarea
                  placeholder="Paste your JSON data here..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={10}
                  className="font-mono text-sm"
                />
                <Button onClick={handleImport} className="w-full mt-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </div>

              <div>
                <Label>Reset to Defaults</Label>
                <p className="text-sm text-gray-500 mb-2">Reset all data to default values</p>
                <Button onClick={handleReset} variant="destructive" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberManagement;
