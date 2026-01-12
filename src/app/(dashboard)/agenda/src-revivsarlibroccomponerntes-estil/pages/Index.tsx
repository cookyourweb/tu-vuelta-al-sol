import { useState } from "react";
import { BirthdayForm } from "@/components/BirthdayForm";
import { PrintableAgenda } from "@/components/PrintableAgenda";
import { StyleProvider } from "@/contexts/StyleContext";

const Index = () => {
  const [agendaData, setAgendaData] = useState<{
    name: string;
    birthday: Date;
  } | null>(null);

  const handleFormSubmit = (name: string, birthday: Date) => {
    setAgendaData({ name, birthday });
  };

  const handleBack = () => {
    setAgendaData(null);
  };

  if (agendaData) {
    return (
      <StyleProvider>
        <PrintableAgenda
          name={agendaData.name}
          birthday={agendaData.birthday}
          onBack={handleBack}
        />
      </StyleProvider>
    );
  }

  return <BirthdayForm onSubmit={handleFormSubmit} />;
};

export default Index;
