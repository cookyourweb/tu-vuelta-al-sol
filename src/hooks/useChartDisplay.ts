import { useState, useEffect } from 'react';

export const useChartDisplay = () => {
  const [showAspects, setShowAspects] = useState(true);
  const [selectedAspectTypes, setSelectedAspectTypes] = useState({
    major: true,
    minor: false,
    hard: true,
    easy: true
  });
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null);
  const [calculatedAspects, setCalculatedAspects] = useState<any[]>([]);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [hoveredModality, setHoveredModality] = useState<string | null>(null);
  const [hoveredNavGuide, setHoveredNavGuide] = useState(false);
  const [activeSection, setActiveSection] = useState('carta-visual');

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ 
      x: event?.clientX ?? 0,
      y: event?.clientY ?? 0
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  useEffect(() => {
    const sections = ['carta-visual', 'aspectos-detectados', 'posiciones-planetarias'];
    const observers: IntersectionObserver[] = [];

    sections.forEach(sectionId => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setActiveSection(sectionId);
            }
          });
        },
        { threshold: 0.5 }
      );

      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return {
    showAspects,
    setShowAspects,
    selectedAspectTypes,
    setSelectedAspectTypes,
    hoveredAspect,
    setHoveredAspect,
    calculatedAspects,
    setCalculatedAspects,
    hoveredPlanet,
    setHoveredPlanet,
    hoveredHouse,
    setHoveredHouse,
    tooltipPosition,
    setTooltipPosition,
    hoveredElement,
    setHoveredElement,
    hoveredModality,
    setHoveredModality,
    hoveredNavGuide,
    setHoveredNavGuide,
    activeSection,
    setActiveSection,
    handleMouseMove,
    scrollToSection
  };
};
