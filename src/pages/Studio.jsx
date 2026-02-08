import React, { useState, useEffect, useRef } from 'react';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Music, Play, Pause, Download, Share2, Plus, X, FileText, Upload, Wand2, Settings, Layers, Music2, Sliders, Box, Sparkles, Zap, Square, Volume2, Maximize2, Minimize2, Save, FolderOpen, MoreVertical, ChevronDown, Mic2, Headphones, Radio } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { MIDIEngine } from "../components/engine/midiEngine";
import { MIDIWriter } from "../components/engine/midiExport";
import { ToneEngine } from "../components/engine/toneEngine";

import { UndoRedoProvider, UndoRedoControls, HistoryTimeline, useUndoRedo } from "../components/studio/UndoRedoManager";
import VariationGenerator from "../components/studio/VariationGenerator";
import SectionEditor from "../components/studio/SectionEditor";
import HarmonySuggester from "../components/studio/HarmonySuggester";
import VoiceInput from "../components/studio/VoiceInput";
import ShareModal from "../components/studio/ShareModal";
import KeyboardShortcuts from "../components/studio/KeyboardShortcuts";
import ThemeToggle from "../components/studio/ThemeToggle";
import ProgressStreak from "../components/studio/ProgressStreak";
import CommandPalette from "../components/studio/CommandPalette";
import ProjectTemplates from "../components/studio/ProjectTemplates";
import ConstraintEditor from "../components/studio/ConstraintEditor";
import ProgressionVisualizer from "../components/studio/ProgressionVisualizer";
import StyleLearning from "../components/studio/StyleLearning";
import SelectiveRegen from "../components/studio/SelectiveRegen";
import TakesBin from "../components/studio/TakesBin";
import TrackManager from "../components/studio/TrackManager";
import TrackMixer from "../components/studio/TrackMixer";
import Confetti from "../components/studio/Confetti";
import HookFinderPanel from "../components/studio/HookFinder";
import TensionMeter from "../components/studio/TensionMeter";
import ModalInterchangePanel from "../components/studio/ModalInterchangePanel";
import CCAutomationPanel from "../components/studio/CCAutomationPanel";
import CounterpointPanel from "../components/studio/CounterpointPanel";
import EuclideanPanel from "../components/studio/EuclideanPanel";
import QuickActions from "../components/studio/QuickActions";
import ABTesting from "../components/studio/ABTesting";
import SmartSuggestions from "../components/studio/SmartSuggestions";
import NoteEditor from "../components/studio/NoteEditor";
import Metronome from "../components/studio/Metronome";
import LoopControls from "../components/studio/LoopControls";
import TempoTap from "../components/studio/TempoTap";
import Markers from "../components/studio/Markers";
import QuantizeDialog from "../components/studio/QuantizeDialog";
import FXChainPanel from "../components/studio/FXChainPanel";
import MasterBusProcessor from "../components/studio/MasterBusProcessor";
import AutomationEditor from "../components/studio/AutomationEditor";
import MIDIRecorder from "../components/studio/MIDIRecorder";
import TrackGrouping from "../components/studio/TrackGrouping";
import BusTracks from "../components/studio/BusTracks";
import MIDILearn from "../components/studio/MIDILearn";
import ExportStems from "../components/studio/ExportStems";
import ProjectNotes from "../components/studio/ProjectNotes";
import MixerSnapshots from "../components/studio/MixerSnapshots";
import GridQuantizePresets from "../components/studio/GridQuantizePresets";
import ScaleHighlight from "../components/studio/ScaleHighlight";
import AutoSave from "../components/studio/AutoSave";
import TimeSignature from "../components/studio/TimeSignature";
import MacroControls from "../components/studio/MacroControls";
import TrackTemplates from "../components/studio/TrackTemplates";
import MasteringTools from "../components/studio/MasteringTools";
import GrooveTemplates from "../components/studio/GrooveTemplates";
import Arpeggiator from "../components/studio/Arpeggiator";
import StepSequencer from "../components/studio/StepSequencer";
import MIDIEffects from "../components/studio/MIDIEffects";
import PresetManager from "../components/studio/PresetManager";
import InstrumentSelector from "../components/studio/InstrumentSelector";
import LiveLoops from "../components/studio/LiveLoops";
import CompingSystem from "../components/studio/CompingSystem";
import SmartTempo from "../components/studio/SmartTempo";
import TrackStacks from "../components/studio/TrackStacks";
import StemSplitter from "../components/studio/StemSplitter";
import WaveformDisplay from "../components/studio/WaveformDisplay";
import AudioRecorder from "../components/studio/AudioRecorder";
import SampleBrowser from "../components/studio/SampleBrowser";
import LoopLibrary from "../components/studio/LoopLibrary";
import AudioWaveformEditor from "../components/studio/AudioWaveformEditor";
import DAWTimeline from "../components/studio/DAWTimeline";
import PianoRollEditor from "../components/studio/PianoRollEditor";
import SampleLibrary from "../components/studio/SampleLibrary";
import ChordLibrary from "../components/studio/ChordLibrary";
import AudioRenderer from "../components/studio/AudioRenderer";
import WaveformPreview from "../components/studio/WaveformPreview";
import SpectrumAnalyzer from "../components/studio/SpectrumAnalyzer";

import AIAssistant from "../components/studio/AIAssistant";
import PerformanceMonitor from "../components/studio/PerformanceMonitor";
import QuickInsert from "../components/studio/QuickInsert";
import ProjectBrowser from "../components/studio/ProjectBrowser"; // This replaces ProjectsList functionality

function MIDIUploader({ onMIDILoaded, midiEngine }) {
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState('import');
  const [currentFile, setCurrentFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCurrentFile(file);
      setIsModalOpen(true);
    }
  };

  const processMIDIFile = async () => {
    if (!currentFile) return;

    try {
      const arrayBuffer = await currentFile.arrayBuffer();
      const midiDataFromEngine = await midiEngine.parseMIDI(arrayBuffer);

      let processedData = {
        tracks: [],
        bpm: midiDataFromEngine.bpm || 120,
        key: midiDataFromEngine.key || 'C',
        scale: midiDataFromEngine.scale || 'major',
        mode: selectedMode,
        prompt: `MIDI imported from ${currentFile.name}`,
      };

      if (selectedMode === 'import') {
        processedData.tracks = midiDataFromEngine.tracks;
      }

      onMIDILoaded(processedData);
      setIsModalOpen(false);
      setCurrentFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('MIDI file processed!');
    } catch (error) {
      toast.error(`Failed to process MIDI: ${error.message}`);
    }
  };

  return (
    <>
      <Button
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        size="sm"
        className="gap-2 w-full justify-start"
      >
        <Upload className="w-4 h-4" />
        Import MIDI
        <input
          type="file"
          accept=".mid,.midi"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#0D0E12] border-white/10">
          <DialogHeader>
            <DialogTitle>Import MIDI: {currentFile?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Button
              onClick={() => setSelectedMode('import')}
              variant={selectedMode === 'import' ? 'default' : 'outline'}
              className="w-full mb-2"
            >
              Import tracks directly
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={processMIDIFile} className="bg-[#16DB93] hover:bg-[#12B878] text-black">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StudioContent() {
  const queryClient = useQueryClient();
  const { saveState, undo, redo } = useUndoRedo();

  const [projectName, setProjectName] = useState('Untitled Project');
  const [currentProject, setCurrentProject] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [maxTracks] = useState(30);
  const [variations, setVariations] = useState([]);
  const [takes, setTakes] = useState([]);
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [totalBeats, setTotalBeats] = useState(32);
  const [generating, setGenerating] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [constraints, setConstraints] = useState([]);
  const [currentProgression, setCurrentProgression] = useState(['I', 'V', 'vi', 'IV']);
  const [learnedStyle, setLearnedStyle] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [structure, setStructure] = useState([
    { name: 'intro', bars: 4 },
    { name: 'verse', bars: 8 },
    { name: 'hook', bars: 8 }
  ]);

  const midiEngine = useRef(new MIDIEngine()).current;
  const midiWriter = useRef(new MIDIWriter()).current;
  const toneEngine = useRef(new ToneEngine()).current;
  const playbackInterval = useRef(null);

  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveProjectName, setSaveProjectName] = useState('');

  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState([]);

  const [loop, setLoop] = useState(null);
  const [gridSnap, setGridSnap] = useState('0.25');
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [scaleHighlight, setScaleHighlight] = useState(null);
  const [trackStacks, setTrackStacks] = useState([]);

  const [activeTab, setActiveTab] = useState('compose');

  const [zoom, setZoom] = useState(1);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [showMinimap, setShowMinimap] = useState(true);

  const [showProjectBrowser, setShowProjectBrowser] = useState(false); // NEW STATE

  useEffect(() => {
    const handleKeyDown = (e) => {
      try {
        const isTyping = e.target.matches('input:not([data-prompt]), textarea:not([data-prompt])');

        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !isTyping) {
          e.preventDefault();
          if (prompt.trim()) handleGenerate(prompt);
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey && !isTyping) {
          e.preventDefault();
          const state = undo();
          if (state) restoreState(state);
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey && !isTyping) {
          e.preventDefault();
          const state = redo();
          if (state) restoreState(state);
        }

        if (e.code === 'Space' && !isTyping) {
          e.preventDefault();
          isPlaying ? handlePause() : handlePlay();
        }

        if (e.key === 'Escape' && !isTyping) {
          e.preventDefault();
          handleStop();
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
          e.preventDefault();
          if (tracks.length > 0) {
            setSaveProjectName(projectName);
            setShowSaveDialog(true);
          }
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
          e.preventDefault();
          handleNewProject();
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'e' && !isTyping) {
          e.preventDefault();
          handleExport();
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setCommandPaletteOpen(true);
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'd' && !isTyping) {
          e.preventDefault();
          if (selectedTrack) {
            handleDuplicateTrack(selectedTrack);
          }
        }

        if (e.key === 'Delete' && !isTyping) {
          e.preventDefault();
          if (selectedNotes.length > 0 && selectedTrack) {
            const newNotes = selectedTrack.notes.filter((_, idx) => !selectedNotes.includes(idx));
            handleUpdateTrack(selectedTrack.id, { notes: newNotes });
            setSelectedNotes([]);
            toast.success(`Deleted ${selectedNotes.length} notes`);
          } else if (selectedTrack) {
            handleRemoveTrack(selectedTrack.id);
          }
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'a' && !isTyping && selectedTrack) {
          e.preventDefault();
          const allIndices = selectedTrack.notes.map((_, idx) => idx);
          setSelectedNotes(allIndices);
          toast.info(`Selected ${allIndices.length} notes`);
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'm' && !isTyping && selectedTrack) {
          e.preventDefault();
          handleUpdateTrack(selectedTrack.id, { muted: !selectedTrack.muted });
        }

        if ((e.metaKey || e.ctrlKey) && e.key === 'l' && !isTyping) {
          e.preventDefault();
          if (!loop) {
            setLoop({ start: 0, end: totalBeats });
            toast.success('Loop enabled');
          } else {
            setLoop(null);
            toast.info('Loop disabled');
          }
        }

        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && !isTyping) {
          e.preventDefault();
          if (tracks.length === 0) return;

          const currentIdx = selectedTrack ? tracks.findIndex(t => t.id === selectedTrack.id) : -1;
          let newIdx;

          if (e.key === 'ArrowUp') {
            newIdx = currentIdx > 0 ? currentIdx - 1 : tracks.length - 1;
          } else {
            newIdx = currentIdx < tracks.length - 1 ? currentIdx + 1 : 0;
          }

          setSelectedTrack(tracks[newIdx]);
        }

        if (e.key === 'f' && !isTyping) {
          e.preventDefault();
          setFullscreen(!fullscreen);
        }

        if (e.key === 'r' && !isTyping) {
          e.preventDefault();
          if (selectedTrack) {
            handleSelectiveRegen([selectedTrack.type]);
          }
        }

        if (e.key === '1' && !isTyping) {
          setActiveTab('compose');
        }
        if (e.key === '2' && !isTyping) {
          setActiveTab('edit');
        }
        if (e.key === '3' && !isTyping) {
          setActiveTab('mix');
        }
        if (e.key === '?' && !isTyping) {
          e.preventDefault();
          setShowKeyboardHelp(prev => !prev);
        }
      } catch (error) {
        console.error('Keyboard shortcut error:', error);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prompt, isPlaying, selectedTrack, selectedNotes, tracks, loop, fullscreen, undo, redo, projectName, totalBeats, showKeyboardHelp]);

  useEffect(() => {
    // Simulate CPU usage based on whether audio is playing
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        if (isPlaying) {
          return Math.min(100, prev + Math.random() * 10); // Increase if playing
        } else {
          return Math.max(0, prev - Math.random() * 5); // Decrease if idle
        }
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isPlaying]); // Re-run when isPlaying changes


  const saveCurrentState = (description) => {
    saveState({ tracks, structure, bpm, prompt, learnedStyle, trackStacks }, description);
    setTakes(prev => [...prev, {
      id: Date.now(),
      tracks,
      structure,
      bpm,
      prompt,
      learnedStyle,
      trackStacks,
      description,
      timestamp: Date.now()
    }]);
  };

  const restoreState = (state) => {
    if (state) {
      setTracks(state.tracks);
      setStructure(state.structure);
      setBpm(state.bpm);
      setPrompt(state.prompt);
      setLearnedStyle(state.learnedStyle || null);
      setTrackStacks(state.trackStacks || []);
      setSelectedTrack(null);
      setSelectedNotes([]);
    }
  };

  const handleCommand = (action) => {
    switch (action) {
      case 'compose':
        handleGenerate(prompt);
        break;
      case 'play':
        isPlaying ? handlePause() : handlePlay();
        break;
      case 'export':
        handleExport();
        break;
      case 'share':
        setShareModalOpen(true);
        break;
      case 'undo':
        const undoState = undo();
        if (undoState) restoreState(undoState);
        break;
      case 'redo':
        const redoState = redo();
        if (redoState) restoreState(redoState);
        break;
      case 'new-project':
        handleNewProject();
        break;
      case 'save-project':
        if (tracks.length > 0) {
          setSaveProjectName(projectName);
          setShowSaveDialog(true);
        }
        break;
    }
  };

  const handleNewProject = () => {
    if (tracks.length > 0) {
      setShowNewProjectDialog(true);
    } else {
      resetProject();
    }
  };

  const resetProject = () => {
    setTracks([]);
    setStructure([
      { name: 'intro', bars: 4 },
      { name: 'verse', bars: 8 },
      { name: 'hook', bars: 8 }
    ]);
    setPrompt('');
    setProjectName('Untitled Project');
    setCurrentProject(null);
    setVariations([]);
    setTakes([]);
    setCurrentBeat(0);
    setTotalBeats(32);
    setBpm(120);
    setCurrentProgression(['I', 'V', 'vi', 'IV']);
    setLearnedStyle(null);
    setSelectedTrack(null);
    setSelectedNotes([]);
    setLoop(null);
    setTimeSignature('4/4');
    setScaleHighlight(null);
    setTrackStacks([]);
    handleStop();
    toast.success('New project started');
    setShowNewProjectDialog(false);
  };

  const handleSaveProject = async () => {
    try {
      const projectData = {
        name: saveProjectName || projectName,
        bpm,
        tracks,
        structure,
        prompt,
        progression: currentProgression,
        learnedStyle,
        time_signature: timeSignature,
        scale_highlight: scaleHighlight,
        track_stacks: trackStacks,
      };

      if (currentProject?.id) {
        await base44.entities.Project.update(currentProject.id, projectData);
        toast.success('Project updated!');
      } else {
        const newProject = await base44.entities.Project.create(projectData);
        setCurrentProject(newProject);
        toast.success('Project saved!');
      }

      setProjectName(saveProjectName || projectName);
      setShowSaveDialog(false);
      setSaveProjectName('');
      queryClient.invalidateQueries(['projects']);
    } catch (error) {
      console.error('Save error:', error);
      
      // Safe error message extraction
      let errorMessage = 'Failed to save project';
      if (error && error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleLoadProject = async (project) => {
    try {
      handleStop();
      setProjectName(project.name);
      setCurrentProject(project);
      setBpm(project.bpm);
      setTracks(project.tracks || []);
      setStructure(project.structure || []);
      setPrompt(project.prompt || '');
      setCurrentProgression(project.progression || ['I', 'V', 'vi', 'IV']);
      setLearnedStyle(project.learnedStyle || null);
      setTimeSignature(project.time_signature || '4/4');
      setScaleHighlight(project.scale_highlight || null);
      setTrackStacks(project.track_stacks || []);
      setVariations([]);
      setTakes([]);
      setCurrentBeat(0);
      setTotalBeats(32);
      setSelectedTrack(null);
      setSelectedNotes([]);
      setLoop(null);
      toast.success(`Loaded: ${project.name}`);
      setShowProjectBrowser(false); // Close browser after loading
    } catch (error) {
      console.error('Load error:', error);
      
      // Safe error message extraction
      let errorMessage = 'Failed to load project';
      if (error && error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    }
  };

  const handleMIDILoaded = (midiData) => {
    const { tracks, bpm } = midiData;

    if (midiData.mode === 'import') {
      saveCurrentState('MIDI imported');

      const tracksWithIds = tracks.map(track => ({
        ...track,
        id: track.id || `${track.type}-${Date.now()}-${Math.random()}`,
        channel: track.channel !== undefined ? track.channel : 0,
        audioUrl: null,
        isAudio: false,
      }));

      setTracks(tracksWithIds);
      setBpm(bpm);

      let maxBeat = 0;
      for (const track of tracksWithIds) {
        for (const note of track.notes || []) {
          if (note.start + note.duration > maxBeat) {
            maxBeat = note.start + note.duration;
          }
        }
      }
      setTotalBeats(Math.ceil(maxBeat));

      setSelectedTrack(null);
      setSelectedNotes([]);
      toast.success('MIDI imported!');
    }
  };

  const handleAddTrack = (trackSpec) => {
    if (tracks.length >= maxTracks) {
      toast.error(`Maximum ${maxTracks} tracks reached`);
      return;
    }

    saveCurrentState('Add track');

    const newTrack = {
      id: `track-${Date.now()}-${Math.random()}`,
      ...trackSpec,
      channel: midiEngine.assignChannel(trackSpec.type),
      notes: [],
      audioUrl: null,
      isAudio: false,
    };

    setTracks(prev => [...prev, newTrack]);
    toast.success(`${trackSpec.name || 'New'} track added!`);
  };

  const handleRemoveTrack = (trackId) => {
    saveCurrentState('Remove track');
    setTracks(prev => prev.filter(t => t.id !== trackId));
    if (selectedTrack?.id === trackId) {
      setSelectedTrack(null);
      setSelectedNotes([]);
    }
    toast.info('Track removed.');
  };

  const handleDuplicateTrack = (track) => {
    if (tracks.length >= maxTracks) {
      toast.error(`Maximum ${maxTracks} tracks reached`);
      return;
    }

    saveCurrentState('Duplicate track');

    const newTrack = {
      ...track,
      id: `track-${Date.now()}-${Math.random()}`,
      name: `${track.name} (Copy)`,
      channel: midiEngine.assignChannel(track.type),
      notes: [...track.notes],
      muted: false,
      solo: false
    };

    setTracks(prev => [...prev, newTrack]);
    toast.success(`Track duplicated!`);
  };

  const handleSelectiveRegen = async (trackTypes) => {
    saveCurrentState('Before selective regen');
    setGenerating(true);

    try {
      const newTracks = [...tracks];

      for (const trackType of trackTypes) {
        const result = midiEngine.generateComposition(
          `regenerate ${trackType}`,
          null, null, null, learnedStyle
        );

        const newTrack = result.tracks.find(t => t.type === trackType);
        if (newTrack) {
          const trackIdx = newTracks.findIndex(t => t.type === trackType);
          if (trackIdx !== -1) {
            newTracks[trackIdx] = {
              ...newTrack,
              audioUrl: null,
              isAudio: false,
            };
          }
        }
      }

      setTracks(newTracks);
      if (selectedTrack) {
        const updatedSelectedTrack = newTracks.find(t => t.id === selectedTrack.id);
        if (updatedSelectedTrack) {
          setSelectedTrack(updatedSelectedTrack);
        }
      }
      saveCurrentState(`Regenerated: ${trackTypes.join(', ')}`);
      toast.success('Regeneration complete!');
    } catch (error) {
      toast.error('Regeneration failed');
    }

    setGenerating(false);
  };

  const handleGenerate = async (promptText) => {
    if (!promptText.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    saveCurrentState('Before generation');
    setGenerating(true);

    try {
      toast.info('AI is composing...');

      const response = await base44.functions.invoke('generateMusic', {
        prompt: promptText,
        structure,
        constraints,
        learnedStyle
      });

      if (response.data.success && response.data.composition) {
        const composition = response.data.composition;

        const tracksWithIds = composition.tracks.map(track => ({
          id: track.id || `${track.type}-${Date.now()}-${Math.random()}`,
          name: track.name || 'Track',
          type: track.type || 'melody',
          channel: track.channel !== undefined ? track.channel : 0,
          program: track.program !== undefined ? track.program : 0,
          volume: track.volume !== undefined ? track.volume : 0.8,
          pan: track.pan !== undefined ? track.pan : 0,
          muted: false,
          solo: false,
          color: track.color || '#64748b',
          notes: track.notes || [],
          audioUrl: null,
          isAudio: false,
        }));

        setTracks(tracksWithIds);
        setBpm(composition.bpm);
        setCurrentProgression(composition.progression || ['I', 'V', 'vi', 'IV']);

        const maxBeat = tracksWithIds.reduce((max, track) => {
          const trackMax = track.notes?.reduce((end, note) =>
            Math.max(end, note.start + note.duration), 0) || 0;
          return Math.max(max, trackMax);
        }, 32);
        setTotalBeats(Math.ceil(maxBeat));

        if (composition.structure) {
          setStructure(composition.structure);
        }

        setSelectedTrack(null);
        setSelectedNotes([]);
        setLoop(null);

        saveCurrentState(`Generated: ${promptText.slice(0, 30)}...`);

        const noteCount = tracksWithIds.reduce((sum, t) => sum + (t.notes?.length || 0), 0);
        toast.success(`✨ Generated ${tracksWithIds.length} tracks • ${noteCount} notes`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        throw new Error(response.data.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Generation error:', error);
      
      // Safe error message extraction
      let errorMessage = 'Generation failed';
      
      if (error && typeof error === 'object') {
        if (error.message) {
          errorMessage = error.message;
        } else if (error.data && error.data.error) {
          errorMessage = error.data.error;
        } else if (error.reason && error.reason.message) {
          errorMessage = error.reason.message;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  const handleAISuggestion = (suggestion) => {
    // This function will receive suggestions from the AI Assistant component
    // Example implementation:
    if (suggestion.type === 'prompt_update') {
      setPrompt(suggestion.payload);
      toast.info('AI suggested a prompt update!');
    } else if (suggestion.type === 'add_track') {
      handleAddTrack(suggestion.payload);
    } else if (suggestion.type === 'regen_track') {
      handleSelectiveRegen([suggestion.payload]);
    } else if (suggestion.type === 'bpm_change') {
      setBpm(suggestion.payload);
    } else if (suggestion.type === 'message') {
      toast.info(`AI Assistant: ${suggestion.payload}`);
    } else if (suggestion.type === 'action' && suggestion.payload === 'open_compose_tab') {
      setActiveTab('compose');
      toast.info('AI assistant wants to show you the compose tab!');
    }
    // Add more logic to handle different suggestion types from AIAssistant
  };

  const handlePlay = async () => {
    console.log('\n🎮 PLAY CLICKED');

    if (tracks.length === 0) {
      toast.error('No tracks - generate music first!');
      return;
    }

    try {
      await toneEngine.initialize();

      if (toneEngine.audioContext.state === 'suspended') {
        await toneEngine.audioContext.resume();
      }

      console.log('Audio State:', toneEngine.audioContext.state);
    } catch (error) {
      console.error('Audio init failed:', error);
      toast.error('Audio initialization failed. Click play again.');
      return;
    }

    const midiTracks = tracks.filter(t => !t.muted && t.notes && t.notes.length > 0 && !t.isAudio);
    const audioTracks = tracks.filter(t => !t.muted && t.audioUrl && t.isAudio);

    console.log(`MIDI: ${midiTracks.length}, Audio: ${audioTracks.length}`);

    if (midiTracks.length === 0 && audioTracks.length === 0) {
      toast.error('No playable content!');
      return;
    }

    let startBeat = currentBeat;
    let endBeat = totalBeats;

    if (loop) {
      if (currentBeat < loop.start || currentBeat >= loop.end) {
        startBeat = loop.start;
      } else {
        startBeat = currentBeat;
      }
      endBeat = loop.end;
    }

    try {
      let scheduledMidiCount = 0;
      if (midiTracks.length > 0) {
        scheduledMidiCount = await toneEngine.playTracks(midiTracks, bpm, startBeat);
      }

      let scheduledAudioCount = 0;
      if (audioTracks.length > 0) {
        scheduledAudioCount = await toneEngine.playAudioTracks(audioTracks, bpm, startBeat);
      }

      if (scheduledMidiCount === 0 && scheduledAudioCount === 0) {
        throw new Error('Nothing scheduled');
      }

      setIsPlaying(true);

      playbackInterval.current = setInterval(() => {
        const now = toneEngine.audioContext.currentTime;
        const elapsed = now - toneEngine.startTime;
        const beatDuration = 60 / bpm;
        const beat = toneEngine.startOffset + (elapsed / beatDuration);

        setCurrentBeat(beat);

        if (beat >= endBeat) {
          if (loop) {
            handleStop();
            setTimeout(() => handlePlay(), 100);
          } else {
            handleStop();
          }
        }
      }, 50);

      toast.success(`▶️ Playing ${midiTracks.length + audioTracks.length} tracks`, {
        duration: 2000
      });
    } catch (error) {
      console.error('Playback error:', error);
      
      // Safe error message extraction
      let errorMessage = 'Playback failed';
      if (error && error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      handleStop();
    }
  };

  const handlePause = () => {
    toneEngine.pause();
    setIsPlaying(false);
    if (playbackInterval.current) {
      clearInterval(playbackInterval.current);
    }
  };

  const handleStop = () => {
    toneEngine.stop();
    setIsPlaying(false);
    setCurrentBeat(0);
    if (playbackInterval.current) {
      clearInterval(playbackInterval.current);
    }
  };

  const handleSeekTo = (beat) => {
    handleStop();
    setCurrentBeat(beat);
  };

  const handleLoopChange = (loopData) => {
    setLoop(loopData);
    if (loopData && currentBeat >= loopData.end) {
      setCurrentBeat(loopData.start);
    }
  };

  const handleUpdateTrack = (trackId, updates) => {
    saveCurrentState('Track update');
    setTracks(prev => {
      const updatedTracks = prev.map(track =>
        track.id === trackId ? { ...track, ...updates } : track
      );
      if (selectedTrack && selectedTrack.id === trackId) {
        setSelectedTrack(updatedTracks.find(t => t.id === trackId));
      }
      return updatedTracks;
    });
  };

  const handleAddNote = (trackId, note) => {
    saveCurrentState('Add note');
    setTracks(prev => prev.map(t =>
      t.id === trackId
        ? { ...t, notes: [...t.notes, note].sort((a, b) => a.start - b.start) }
        : t
    ));
  };

  const handleDeleteNote = (trackId, noteIdx) => {
    saveCurrentState('Delete note');
    setTracks(prev => prev.map(t =>
      t.id === trackId
        ? { ...t, notes: t.notes.filter((_, i) => i !== noteIdx) }
        : t
    ));
  };

  const handleQuantize = (quantizedTrack) => {
    saveCurrentState('Quantize notes');
    setTracks(prev => prev.map(t =>
      t.id === quantizedTrack.id ? quantizedTrack : t
    ));
  };

  const handleExport = () => {
    if (tracks.length === 0) {
      toast.error('No tracks to export');
      return;
    }

    midiWriter.downloadMIDI(tracks.filter(t => !t.isAudio), bpm, `${projectName}.mid`);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    toast.success('MIDI exported!');
  };

  const handleApplyVariation = (track) => {
    saveCurrentState('Applied variation');
    setTracks(prev => prev.map(t => t.type === track.type ? track : t));
    if (selectedTrack?.type === track.type) {
      setSelectedTrack(track);
    }
  };

  const handleApplyChords = (chordTrack) => {
    saveCurrentState('Applied harmony');
    setTracks(prev => {
      const filtered = prev.filter(t => t.type !== 'chords');
      return [...filtered, chordTrack];
    });
  };

  const handleMelodyFromVoice = (notes) => {
    saveCurrentState('Voice input melody');
    const melodyTrack = {
      id: 'melody',
      name: 'Melody',
      type: 'melody',
      channel: 0,
      program: 80,
      volume: 0.8,
      pan: 0,
      muted: false,
      solo: false,
      notes,
      audioUrl: null,
      isAudio: false,
    };

    setTracks(prev => {
      const filtered = prev.filter(t => t.type !== 'melody');
      return [...filtered, melodyTrack];
    });
  };

  const handleRestoreTake = (take) => {
    setTracks(take.tracks);
    setStructure(take.structure);
    setBpm(take.bpm);
    setPrompt(take.prompt);
    setLearnedStyle(take.learnedStyle || null);
    setTrackStacks(take.trackStacks || []);
    setSelectedTrack(null);
    setSelectedNotes([]);
    setLoop(null);
    toast.success('Take restored');
  };

  const handleDeleteTake = (takeId) => {
    setTakes(prev => prev.filter(t => t.id !== takeId));
    toast.success('Take deleted');
  };

  const handleApplyCountermelody = (counterTrack) => {
    saveCurrentState('Added countermelody');
    const newCounterTrack = {
      ...counterTrack,
      audioUrl: null,
      isAudio: false,
    };
    setTracks(prev => [...prev, newCounterTrack]);
  };

  const handleApplyRhythm = (rhythmNotes) => {
    saveCurrentState('Applied Euclidean rhythm');
    setTracks(prev => {
      let drumTrack = prev.find(t => t.type === 'drums');
      let updatedTracks;
      if (drumTrack) {
        updatedTracks = prev.map(t =>
          t.type === 'drums' ? { ...t, notes: [...t.notes, ...rhythmNotes] } : t
        );
      } else {
        const newDrumTrack = {
          id: `drums-${Date.now()}`,
          name: 'Drums',
          type: 'drums',
          channel: 9,
          program: 0,
          volume: 0.8,
          pan: 0,
          muted: false,
          solo: false,
          notes: rhythmNotes,
          audioUrl: null,
          isAudio: false,
        };
        updatedTracks = [...prev, newDrumTrack];
      }
      return updatedTracks;
    });
  };

  const handleHighlightSection = (startBeat, endBeat) => {
    setCurrentBeat(startBeat);
    toast.info(`Section: ${startBeat} - ${endBeat}`);
  };

  const handleQuickGenerate = (quickPrompt) => {
    const fullPrompt = `${prompt}. ${quickPrompt}`;
    handleGenerate(fullPrompt);
  };

  const handleRandomize = () => {
    const styles = ['trap', 'lofi', 'jazz', 'rnb', 'afrobeats'];
    const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const scales = ['major', 'minor', 'dorian'];

    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomScale = scales[Math.floor(Math.random() * scales.length)];
    const randomBpm = 80 + Math.floor(Math.random() * 80);

    const randomPrompt = `${randomStyle}, ${randomKey} ${randomScale}, ${randomBpm} bpm`;
    setPrompt(randomPrompt);
    toast.success('Randomized!');
  };

  const handleMIDIRecorded = (notes) => {
    if (!selectedTrack) {
      toast.error('Select a track first');
      return;
    }

    saveCurrentState('MIDI recorded');
    setTracks(prev => prev.map(t =>
      t.id === selectedTrack.id
        ? { ...t, notes: [...t.notes, ...notes].sort((a, b) => a.start - b.start) }
        : t
    ));
    toast.success(`Added ${notes.length} notes`);
  };

  const handleApplyArpeggio = (notes) => {
    if (!selectedTrack) {
      toast.error('Select a track first');
      return;
    }

    saveCurrentState('Applied arpeggio');
    setTracks(prev => prev.map(t =>
      t.id === selectedTrack.id ? { ...t, notes } : t
    ));
    toast.success('Arpeggio applied!');
  };

  const handleApplyStepPattern = (notes) => {
    saveCurrentState('Applied step pattern');

    const drumTrack = tracks.find(t => t.type === 'drums');
    if (drumTrack) {
      setTracks(prev => prev.map(t =>
        t.type === 'drums' ? { ...t, notes: [...t.notes, ...notes] } : t
      ));
    } else {
      const newDrumTrack = {
        id: `drums-${Date.now()}`,
        name: 'Drums',
        type: 'drums',
        channel: 9,
        program: 0,
        volume: 0.8,
        pan: 0,
        muted: false,
        solo: false,
        notes,
        audioUrl: null,
        isAudio: false,
      };
      setTracks(prev => [...prev, newDrumTrack]);
    }
    toast.success('Step pattern applied!');
  };

  const handleLoadPreset = (presetData) => {
    if (!selectedTrack) {
      toast.error('Select a track first');
      return;
    }

    saveCurrentState('Loaded preset');
    setTracks(prev => prev.map(t =>
      t.id === selectedTrack.id ? { ...t, ...presetData } : t
    ));
    toast.success('Preset loaded!');
  };

  const handleSelectInstrument = (trackId, instrumentId) => {
    saveCurrentState('Changed instrument');
    setTracks(prev => prev.map(t =>
      t.id === trackId ? { ...t, instrument: instrumentId } : t
    ));
    toast.success(`Instrument changed!`);
  };

  const handleCaptureToTimeline = (clips) => {
    saveCurrentState('Captured clips');

    const newTracks = [...tracks];

    clips.forEach(clip => {
      const existingTrack = newTracks.find(t => t.id === clip.track);
      if (existingTrack) {
        const maxBeat = existingTrack.notes.length > 0
          ? Math.max(...existingTrack.notes.map(n => n.start + n.duration))
          : 0;

        const offsetNotes = clip.notes.map(note => ({
          ...note,
          start: note.start + maxBeat
        }));

        existingTrack.notes = [...existingTrack.notes, ...offsetNotes].sort((a, b) => a.start - b.start);
      } else {
        newTracks.push({
          id: clip.track,
          name: `Live Loop ${clip.track.split('-')[1]}`,
          type: 'midi',
          channel: midiEngine.assignChannel('midi'),
          program: 0,
          volume: 0.8,
          pan: 0,
          muted: false,
          solo: false,
          notes: clip.notes,
          audioUrl: null,
          isAudio: false,
        });
      }
    });

    setTracks(newTracks);
    toast.success('Clips captured!');
  };

  const handleTempoDetected = (detectedBpm) => {
    console.log('Detected BPM:', detectedBpm);
  };

  const handleApplyTempo = (newBpm, mode) => {
    saveCurrentState('Applied Smart Tempo');

    if (mode === 'adapt') {
      setBpm(newBpm);
    }

    toast.success(`Tempo: ${newBpm} BPM`);
  };

  const handleUpdateStacks = (newStacks) => {
    setTrackStacks(newStacks);
    saveCurrentState('Updated track stacks');
  };

  const handleStemsExtracted = (stems) => {
    saveCurrentState('Imported stems');

    const newTracks = stems.map(stem => ({
      id: `stem-${stem.type}-${Date.now()}-${Math.random()}`,
      name: stem.name,
      type: 'audio',
      channel: tracks.length + stems.indexOf(stem),
      program: 0,
      volume: 0.75,
      pan: 0,
      muted: false,
      solo: false,
      color: stem.color,
      notes: [],
      audioUrl: stem.url,
      isStem: true,
      isAudio: true
    }));

    setTracks(prev => [...prev, ...newTracks]);

    if (newTracks.length > 0) {
      setSelectedTrack(newTracks[0]);
    }

    toast.success(`Added ${newTracks.length} stems!`);
  };

  const handleRecordingComplete = (recordingData) => {
    saveCurrentState('Added recording');

    const newTrack = {
      id: `recording-${Date.now()}`,
      name: `Audio ${tracks.filter(t => t.isAudio && !t.isStem).length + 1}`,
      type: 'audio',
      channel: tracks.length,
      volume: 0.75,
      pan: 0,
      muted: false,
      solo: false,
      color: '#FF6B6B',
      notes: [],
      audioUrl: recordingData.audioUrl,
      isAudio: true
    };

    setTracks(prev => [...prev, newTrack]);
    setSelectedTrack(newTrack);
    toast.success('Recording added!');
  };

  const handleSampleSelect = (sample) => {
    saveCurrentState('Added sample');

    const newTrack = {
      id: `sample-${Date.now()}`,
      name: sample.name,
      type: 'audio',
      channel: tracks.length,
      volume: 0.75,
      pan: 0,
      muted: false,
      solo: false,
      color: sample.color || '#FFD700',
      notes: [],
      audioUrl: sample.url,
      isAudio: true
    };

    setTracks(prev => [...prev, newTrack]);
    setSelectedTrack(newTrack);
    toast.success(`Added: ${sample.name}`);
  };

  const handleLoopSelect = (loop) => {
    saveCurrentState('Added loop');

    const newTrack = {
      id: `loop-${Date.now()}`,
      name: loop.name,
      type: 'audio',
      channel: tracks.length,
      volume: 0.75,
      pan: 0,
      muted: false,
      solo: false,
      color: '#B18CFF',
      notes: [],
      audioUrl: loop.url,
      isAudio: true,
      isLoop: true,
      originalBpm: loop.bpm
    };

    setTracks(prev => [...prev, newTrack]);
    setSelectedTrack(newTrack);
    toast.success(`Added: ${loop.name}`);
  };

  const handleChordProgressionSelect = (chordTrack) => {
    saveCurrentState('Added chord progression');
    setTracks(prev => {
      const filtered = prev.filter(t => t.type !== 'chords');
      return [...filtered, chordTrack];
    });
    setSelectedTrack(chordTrack);
  };

  const handleAddSampleToTrack = (sample) => {
    handleSampleSelect(sample);
  };

  return (
    <div className={cn(
      "flex h-screen text-white overflow-hidden",
      fullscreen && "fixed inset-0 z-50"
    )}
    style={{ background: 'var(--bg)' }}
    >
      {/* Sidebar */}
      <aside className={cn(
        "border-r flex flex-col",
        sidebarCollapsed ? "w-[64px]" : "w-[280px]"
      )}
      style={{ 
        background: 'var(--bg)',
        borderColor: 'var(--border)'
      }}
      >
        {/* Header */}
        <div className="p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          {!sidebarCollapsed && (
            <>
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-lg font-semibold text-white">
                  {projectName}
                </h1>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="btn-icon"
                >
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
              <p className="text-sm text-white/40">AI Music Studio</p>
            </>
          )}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="btn-icon mx-auto"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
          )}
        </div>

        {!sidebarCollapsed && (
          <>
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
              <TabsList className="flex-shrink-0 flex w-full border-b h-12 p-0 gap-0 rounded-none" style={{ background: 'transparent', borderColor: 'var(--border)' }}>
                <TabsTrigger value="compose" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#7C3AED] text-sm font-medium text-white/40 data-[state=active]:text-white hover:text-white/70 transition-all">
                  Create
                </TabsTrigger>
                <TabsTrigger value="edit" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#7C3AED] text-sm font-medium text-white/40 data-[state=active]:text-white hover:text-white/70 transition-all">
                  Edit
                </TabsTrigger>
                <TabsTrigger value="mix" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#7C3AED] text-sm font-medium text-white/40 data-[state=active]:text-white hover:text-white/70 transition-all">
                  Mix
                </TabsTrigger>
                <TabsTrigger value="project" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#7C3AED] text-sm font-medium text-white/40 data-[state=active]:text-white hover:text-white/70 transition-all">
                  Project
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                {/* COMPOSE TAB */}
                <TabsContent value="compose" className="p-6 space-y-6 m-0 h-auto pb-20">
                  {/* AI Assistant - NEW FEATURE */}
                  <AIAssistant
                    currentPrompt={prompt}
                    tracks={tracks}
                    bpm={bpm}
                    onApplySuggestion={handleAISuggestion}
                    onGenerate={handleGenerate}
                    generating={generating}
                  />

                  {/* Performance Monitor - NEW FEATURE */}
                  <PerformanceMonitor
                    tracks={tracks}
                    isPlaying={isPlaying}
                    cpuUsage={cpuUsage}
                  />

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-3 block text-white/70">
                        Describe your song
                      </label>
                      <textarea
                        data-prompt
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="lofi hip hop, 85 bpm, chill vibes, piano and vinyl crackle..."
                        className="w-full h-28 px-4 py-3 rounded-lg text-sm resize-none transition-all"
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          color: 'var(--text)',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>

                    <button
                      onClick={() => handleGenerate(prompt)}
                      disabled={generating || !prompt.trim()}
                      className="w-full py-4 rounded-lg font-semibold disabled:opacity-40 transition-all"
                      style={{
                        background: 'var(--accent)',
                        color: 'white'
                      }}
                      onMouseEnter={(e) => !generating && (e.target.style.background = 'var(--accent-hover)')}
                      onMouseLeave={(e) => !generating && (e.target.style.background = 'var(--accent)')}
                    >
                      {generating ? 'Generating...' : 'Generate'}
                    </button>

                    <QuickActions
                      onGenerateVariation={handleQuickGenerate}
                      onSuggestImprovement={() => toast.info('AI analyzing...')}
                      onRandomize={handleRandomize}
                    />

                    {/* Quick Insert - NEW FEATURE */}
                    <QuickInsert onInsert={handleAddTrack} />

                    {tracks.length > 0 && (
                      <SmartSuggestions
                        tracks={tracks}
                        prompt={prompt}
                        onApplySuggestion={(suggestion) => {
                          setPrompt(suggestion);
                          toast.info(`Prompt updated`);
                        }}
                        midiEngine={midiEngine}
                        bpm={bpm}
                        currentKey="C"
                        currentScale="major"
                      />
                    )}
                  </div>

                  <div className="pt-5 border-t border-white/5">
                    <h3 className="text-xs uppercase tracking-wider text-white/40 font-bold mb-3">
                      Libraries
                    </h3>
                    <div className="space-y-2">
                      <ChordLibrary onSelectProgression={handleChordProgressionSelect} />
                      <SampleLibrary
                        onSampleSelect={handleSampleSelect}
                        onAddToTrack={handleAddSampleToTrack}
                      />
                      <LoopLibrary
                        onLoopSelect={handleLoopSelect}
                        currentBpm={bpm}
                      />
                    </div>
                  </div>

                  <div className="pt-5 border-t border-white/5">
                    <h3 className="text-xs uppercase tracking-wider text-white/40 font-bold mb-3">
                      Quick Start
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <ProjectTemplates onSelectTemplate={(template) => setPrompt(template)} />
                      <StyleLearning onStyleLearned={setLearnedStyle} />
                      <StemSplitter onStemsExtracted={handleStemsExtracted} />
                      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                    </div>
                  </div>

                  <div className="pt-5 border-t border-white/5">
                    <h3 className="text-xs uppercase tracking-wider text-white/40 font-bold mb-3">
                      Settings
                    </h3>
                    <div className="space-y-2">
                      <TimeSignature
                        value={timeSignature}
                        onChange={setTimeSignature}
                      />
                      <ScaleHighlight onScaleChange={setScaleHighlight} />
                    </div>
                  </div>

                  {tracks.length > 0 && (
                    <>
                      <div className="pt-5 border-t border-white/5">
                        <SectionEditor
                          structure={structure}
                          onChange={(newStructure) => {
                            saveCurrentState('Structure change');
                            setStructure(newStructure);
                          }}
                        />
                      </div>
                      <ProgressionVisualizer progression={currentProgression} />
                      <ConstraintEditor constraints={constraints} onChange={setConstraints} />
                    </>
                  )}
                </TabsContent>

                {/* EDIT TAB */}
                <TabsContent value="edit" className="p-5 space-y-5 m-0 h-auto pb-20">
                  {selectedTrack ? (
                    <>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-[#7C61FF]/10 to-transparent border border-[#7C61FF]/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: selectedTrack.color || '#64748b' }}>
                            {selectedTrack.isAudio ? <Headphones className="w-5 h-5 text-white" /> : <Music2 className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-base">{selectedTrack.name}</h3>
                            <p className="text-xs text-white/50">
                              {selectedTrack.isAudio ? 'Audio Track' : `${selectedTrack.notes?.length || 0} notes`}
                            </p>
                          </div>
                        </div>
                      </div>

                      {selectedTrack.isAudio && selectedTrack.audioUrl && (
                        <WaveformDisplay
                          audioUrl={selectedTrack.audioUrl}
                          track={selectedTrack}
                          onUpdateTrack={handleUpdateTrack}
                        />
                      )}

                      {!selectedTrack.isAudio && (
                        <>
                          <NoteEditor
                            track={selectedTrack}
                            onUpdateTrack={handleUpdateTrack}
                            totalBeats={totalBeats}
                            scaleHighlight={scaleHighlight}
                          />

                          <InstrumentSelector
                            track={selectedTrack}
                            onSelectInstrument={handleSelectInstrument}
                          />

                          {selectedTrack.notes && selectedTrack.notes.length > 0 && (
                            <CompingSystem
                              track={selectedTrack}
                              onUpdateTrack={handleUpdateTrack}
                            />
                          )}

                          <div className="space-y-2">
                            <h3 className="text-xs uppercase tracking-wider text-white/40 font-bold">
                              MIDI Tools
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              <Arpeggiator
                                track={selectedTrack}
                                onApplyArpeggio={handleApplyArpeggio}
                                totalBeats={totalBeats}
                              />
                              <StepSequencer
                                onApplyPattern={handleApplyStepPattern}
                                bpm={bpm}
                              />
                              <MIDIEffects
                                track={selectedTrack}
                                onUpdateTrack={handleUpdateTrack}
                              />
                              <PresetManager
                                track={selectedTrack}
                                onLoadPreset={handleLoadPreset}
                              />
                              <MIDIRecorder
                                track={selectedTrack}
                                bpm={bpm}
                                onRecordingComplete={handleMIDIRecorded}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Sliders className="w-8 h-8 text-white/20" />
                      </div>
                      <p className="text-white/40 text-sm">
                        Select a track to edit
                      </p>
                    </div>
                  )}

                  {tracks.length > 0 && (
                    <div className="pt-5 border-t border-white/5 space-y-3">
                      <h3 className="text-xs uppercase tracking-wider text-white/40 font-bold">
                        Advanced Editing
                      </h3>
                      <VariationGenerator
                        tracks={tracks}
                        onApplyVariation={handleApplyVariation}
                        midiEngine={midiEngine}
                      />
                      <SelectiveRegen
                        structure={structure}
                        tracks={tracks}
                        onRegenerate={setTracks}
                        midiEngine={midiEngine}
                      />
                      {tracks.find(t => t.type === 'melody') && (
                        <HarmonySuggester
                          melodyTrack={tracks.find(t => t.type === 'melody')}
                          onApplyChords={handleApplyChords}
                          midiEngine={midiEngine}
                        />
                      )}
                    </div>
                  )}
                </TabsContent>

                {/* MIX TAB */}
                <TabsContent value="mix" className="p-5 space-y-5 m-0 h-auto pb-20">
                  {tracks.length > 0 ? (
                    <>
                      <TrackManager
                        tracks={tracks}
                        onAddTrack={handleAddTrack}
                        onRemoveTrack={handleRemoveTrack}
                        onDuplicateTrack={handleDuplicateTrack}
                        maxTracks={maxTracks}
                      />

                      {selectedTrack && (
                        <div className="space-y-2">
                          <h3 className="text-xs uppercase tracking-wider text-white/40 font-bold">
                            Track FX
                          </h3>
                          <FXChainPanel
                            track={selectedTrack}
                            onUpdateTrack={handleUpdateTrack}
                          />
                          <AutomationEditor
                            track={selectedTrack}
                            totalBeats={totalBeats}
                            onUpdateTrack={handleUpdateTrack}
                          />
                        </div>
                      )}

                      <div className="pt-5 border-t border-white/5 space-y-2">
                        <h3 className="text-xs uppercase tracking-wider text-white/40 font-bold">
                          Master & Routing
                        </h3>
                        <MasterBusProcessor
                          onUpdate={(settings) => console.log('Master bus:', settings)}
                        />
                        <MasteringTools tracks={tracks} />
                        <TrackGrouping
                          tracks={tracks}
                          onUpdateGroups={(groups) => console.log('Groups:', groups)}
                        />
                        <BusTracks
                          tracks={tracks}
                          onUpdateBuses={(buses) => console.log('Buses:', buses)}
                        />
                      </div>

                      <div className="pt-5 border-t border-white/5 space-y-2">
                        <h3 className="text-xs uppercase tracking-wider text-white/40 font-bold">
                          Mixer Tools
                        </h3>
                        <MixerSnapshots
                          tracks={tracks}
                          onApplySnapshot={(state) => {
                            state.forEach(s => {
                              handleUpdateTrack(s.id, {
                                volume: s.volume,
                                pan: s.pan,
                                muted: s.muted,
                                solo: s.solo
                              });
                            });
                            toast.success('Snapshot applied!');
                          }}
                        />
                        <MIDILearn
                          onMappingChange={(mapping) => console.log('MIDI Mapping:', mapping)}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Layers className="w-8 h-8 text-white/20" />
                      </div>
                      <p className="text-white/40 text-sm">
                        Generate music first
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* PROJECT TAB */}
                <TabsContent value="project" className="p-5 space-y-5 m-0 h-auto pb-20">
                  <div className="space-y-2">
                    <h3 className="text-xs uppercase tracking-wider text-white/40 font-bold">
                      Project
                    </h3>
                    <div className="grid gap-2">
                      <Button
                        onClick={handleNewProject}
                        variant="outline"
                        size="sm"
                        className="gap-2 justify-start"
                      >
                        <Plus className="w-4 h-4" />
                        New Project
                      </Button>
                      <Button
                        onClick={() => {
                          setSaveProjectName(projectName);
                          setShowSaveDialog(true);
                        }}
                        variant="outline"
                        size="sm"
                        className="gap-2 justify-start"
                        disabled={tracks.length === 0}
                      >
                        <Save className="w-4 h-4" />
                        Save Project
                      </Button>
                      <Button
                        onClick={() => setShowProjectBrowser(true)}
                        variant="outline"
                        size="sm"
                        className="gap-2 justify-start"
                      >
                        <FolderOpen className="w-4 h-4" />
                        Browse Projects
                      </Button>
                      <MIDIUploader onMIDILoaded={handleMIDILoaded} midiEngine={midiEngine} />
                    </div>
                  </div>

                  <AutoSave
                    projectData={{ tracks, bpm, structure, projectName, timeSignature, scaleHighlight, currentProgression, learnedStyle, trackStacks }}
                    onSave={async (data) => {
                      try {
                        const projectPayload = {
                          name: data.projectName,
                          bpm: data.bpm,
                          tracks: data.tracks,
                          structure: data.structure,
                          prompt,
                          progression: data.currentProgression,
                          learnedStyle: data.learnedStyle,
                          time_signature: data.timeSignature,
                          scale_highlight: data.scaleHighlight,
                          track_stacks: data.trackStacks,
                        };

                        if (currentProject?.id) {
                          await base44.entities.Project.update(currentProject.id, projectPayload);
                        } else if (data.tracks.length > 0) {
                          const newProject = await base44.entities.Project.create(projectPayload);
                          setCurrentProject(newProject);
                          setProjectName(newProject.name);
                        }
                      } catch (error) {
                        console.error("Auto-save failed:", error);
                      }
                    }}
                  />

                  <div className="pt-5 border-t border-white/5 space-y-2">
                    <h3 className="text-xs uppercase tracking-wider text-white/40 font-bold">
                      Export
                    </h3>
                    <div className="grid gap-2">
                      <Button
                        onClick={handleExport}
                        variant="outline"
                        size="sm"
                        className="gap-2 justify-start"
                        disabled={tracks.length === 0}
                      >
                        <Download className="w-4 h-4" />
                        Export MIDI
                      </Button>
                      <AudioRenderer
                        tracks={tracks}
                        bpm={bpm}
                        projectName={projectName}
                      />
                      <ExportStems
                        tracks={tracks}
                        bpm={bpm}
                        projectName={projectName}
                        midiWriter={midiWriter}
                      />
                      <Button
                        onClick={() => setShareModalOpen(true)}
                        variant="outline"
                        size="sm"
                        className="gap-2 justify-start"
                        disabled={tracks.length === 0}
                      >
                        <Share2 className="w-4 h-4" />
                        Share Project
                      </Button>
                    </div>
                  </div>

                  <HistoryTimeline />

                  {/* Takes Bin - NEW */}
                  {takes.length > 0 && (
                    <TakesBin
                      takes={takes}
                      onRestoreTake={handleRestoreTake}
                      onDeleteTake={handleDeleteTake}
                    />
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}

        {sidebarCollapsed && (
          <div className="flex-1 flex flex-col items-center gap-4 py-6">
            <button onClick={() => setActiveTab('compose')} className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors", activeTab === 'compose' ? 'bg-[#16DB93]/10 text-[#16DB93]' : 'hover:bg-white/5')}>
              <Wand2 className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab('edit')} className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors", activeTab === 'edit' ? 'bg-[#7C61FF]/10 text-[#7C61FF]' : 'hover:bg-white/5')}>
              <Sliders className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab('mix')} className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors", activeTab === 'mix' ? 'bg-[#7DF1FF]/10 text-[#7DF1FF]' : 'hover:bg-white/5')}>
              <Layers className="w-5 h-5" />
            </button>
            <button onClick={() => setActiveTab('project')} className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors", activeTab === 'project' ? 'bg-[#FF6B6B]/10 text-[#FF6B6B]' : 'hover:bg-white/5')}>
              <FileText className="w-5 h-5" />
            </button>
          </div>
        )}
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--bg)' }}>
        {/* Minimal Transport Bar */}
        <div className="sticky top-0 z-10 border-b backdrop-blur-xl" style={{ 
          background: 'rgba(18, 18, 18, 0.8)', 
          borderColor: 'rgba(255,255,255,0.06)'
        }}>
          <div className="px-6 py-3">
            
            <div className="flex items-center justify-between gap-6">
              {/* Left: Time Display */}
              <div className="flex items-center gap-4 flex-1">
                <div className="font-mono text-2xl font-semibold tabular-nums text-white/90">
                  {Math.floor(currentBeat / bpm)}:{String(Math.floor((currentBeat / bpm * 60) % 60)).padStart(2, '0')}
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="font-mono text-lg font-medium tabular-nums text-white/60">
                  {Math.floor(currentBeat / 4) + 1}.{Math.floor(currentBeat % 4) + 1}
                </div>

                {structure.length > 0 && (
                  <div className="flex items-center gap-2">
                    {structure.slice(0, 3).map((section, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}
                      >
                        {section.name}
                      </div>
                    ))}
                    {loop && (
                      <div className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2"
                        style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA' }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                        Loop
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Center: Transport Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStop}
                  className="transport-btn"
                  disabled={!isPlaying && currentBeat === 0}
                >
                  <Square className="w-4 h-4" />
                </button>

                <button
                  onClick={isPlaying ? handlePause : handlePlay}
                  data-action="play"
                  className="transport-btn play"
                  disabled={tracks.length === 0}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={handleExport}
                  className="transport-btn"
                  disabled={tracks.length === 0}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Right: Info */}
              <div className="flex items-center gap-4 flex-1 justify-end">
                <div className="font-mono text-xl font-semibold tabular-nums text-white/80">
                  {bpm}
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="font-mono text-sm font-medium text-white/60">
                  {timeSignature}
                </div>
                {tracks.length > 0 && (
                  <>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="text-sm font-medium text-white/60">
                      {tracks.length} tracks
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Minimal Progress Bar */}
            <div className="relative h-1 overflow-hidden mt-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
              {loop && (
                <div
                  className="absolute h-full"
                  style={{
                    left: `${(loop.start / totalBeats) * 100}%`,
                    width: `${((loop.end - loop.start) / totalBeats) * 100}%`,
                    background: 'rgba(139,92,246,0.2)'
                  }}
                />
              )}
              <div
                className="absolute h-full transition-all duration-75"
                style={{ 
                  width: `${(currentBeat / totalBeats) * 100}%`,
                  background: '#8B5CF6'
                }}
              />
            </div>
          </div>
        </div>

        {/* Workspace Content */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Zoom Controls (floating) */}
          {tracks.length > 0 && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 backdrop-blur-xl border border-white/10 rounded-xl p-2 shadow-xl" style={{ background: 'rgba(17, 17, 22, 0.95)' }}>
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8B949E] hover:text-white hover:bg-white/5 transition-all"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              >
                <span className="text-lg">−</span>
              </button>
              <span className="text-[10px] font-mono text-[#8B949E] w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#8B949E] hover:text-white hover:bg-white/5 transition-all"
                onClick={() => setZoom(Math.min(4, zoom + 0.25))}
              >
                <span className="text-lg">+</span>
              </button>
              <div className="w-px h-4 bg-white/10 mx-1" />
              <button
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center transition-all",
                  showMinimap ? "text-[#00D9FF] bg-[#00D9FF]/10" : "text-[#8B949E] hover:text-white hover:bg-white/5"
                )}
                onClick={() => setShowMinimap(!showMinimap)}
                title="Toggle Minimap"
              >
                <Box className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {tracks.length > 0 ? (
            <Tabs value="timeline" className="h-full flex flex-col min-h-0">
              <TabsList className="flex-shrink-0 mx-6 mt-4 rounded-lg p-1" style={{ background: 'var(--surface)' }}>
                <TabsTrigger value="timeline" className="rounded-md text-sm px-4 py-2 transition-all data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-white/50 font-medium">
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="piano" className="rounded-md text-sm px-4 py-2 transition-all data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-white/50 font-medium">
                  Piano
                </TabsTrigger>
                <TabsTrigger value="mixer" className="rounded-md text-sm px-4 py-2 transition-all data-[state=active]:bg-[#7C3AED] data-[state=active]:text-white text-white/50 font-medium">
                  Mixer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="flex-1 m-0 p-0 overflow-hidden">
                <DAWTimeline
                  tracks={tracks}
                  currentBeat={currentBeat}
                  totalBeats={totalBeats}
                  bpm={bpm}
                  onUpdateTrack={handleUpdateTrack}
                  onSeekTo={handleSeekTo}
                  onSetLoop={handleLoopChange}
                  currentLoop={loop}
                  selectedTrackId={selectedTrack?.id}
                  onSelectTrack={setSelectedTrack}
                  zoom={zoom}
                />

                {/* Minimap */}
                {showMinimap && (
                  <div className="absolute bottom-4 left-[240px] right-4 h-14 backdrop-blur-xl border border-white/5 rounded-xl p-2 shadow-xl" style={{ background: 'rgba(17, 17, 22, 0.95)' }}>
                    <div className="relative h-full rounded-lg overflow-hidden" style={{ background: '#060608' }}>
                      {tracks.map((track, idx) => {
                        const color = track.color || '#64748B';
                        return (
                          <div
                            key={track.id}
                            className="absolute h-1 rounded-full"
                            style={{
                              top: `${(idx / tracks.length) * 100}%`,
                              left: 0,
                              right: 0,
                              backgroundColor: color + '40'
                            }}
                          />
                        );
                      })}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 shadow-[0_0_8px_#00F0FF]"
                        style={{ left: `${(currentBeat / totalBeats) * 100}%`, background: '#00F0FF' }}
                      />
                      {loop && (
                        <div
                          className="absolute top-0 bottom-0 border-x"
                          style={{ background: 'rgba(0,240,255,0.1)', borderColor: 'rgba(0,240,255,0.3)' }}
                          style={{
                            left: `${(loop.start / totalBeats) * 100}%`,
                            width: `${((loop.end - loop.start) / totalBeats) * 100}%`
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="piano" className="flex-1 m-0 p-6 overflow-hidden">
                <div className="h-full flex flex-col rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                  <div className="px-5 py-3 border-b flex-shrink-0 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                    <h3 className="text-sm font-medium text-white">
                      {selectedTrack ? selectedTrack.name : 'Piano Roll'}
                    </h3>
                    {selectedTrack && (
                      <div className="text-sm text-white/40">
                        {selectedTrack.notes?.length || 0} notes
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {selectedTrack?.isAudio ? (
                      <AudioWaveformEditor
                        track={selectedTrack}
                        currentBeat={currentBeat}
                        totalBeats={totalBeats}
                        onUpdateTrack={handleUpdateTrack}
                        bpm={bpm}
                      />
                    ) : (
                      <PianoRollEditor
                        tracks={tracks}
                        currentBeat={currentBeat}
                        totalBeats={totalBeats}
                        selectedTrackId={selectedTrack?.id}
                        onUpdateTrack={handleUpdateTrack}
                        onAddNote={handleAddNote}
                        onDeleteNote={handleDeleteNote}
                        gridSnap={parseFloat(gridSnap)}
                        scaleHighlight={scaleHighlight}
                        selectedNotes={selectedNotes}
                        onSelectNotes={setSelectedNotes}
                      />
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mixer" className="flex-1 m-0 p-4 overflow-auto">
                <TrackMixer
                  tracks={tracks}
                  onUpdateTrack={handleUpdateTrack}
                  onSelectTrack={setSelectedTrack}
                  selectedTrackId={selectedTrack?.id}
                />
              </TabsContent>
            </Tabs>
          ) : (
            /* Clean Empty State */
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-8 max-w-md">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: 'var(--surface)' }}>
                  <Music className="w-8 h-8 text-white/40" />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold mb-2 text-white">
                    Create something new
                  </h2>
                  <p className="text-sm text-white/50">
                    Describe your song and let AI compose
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('compose')}
                  className="px-6 py-3 rounded-lg font-semibold transition-all mx-auto block"
                  style={{ background: 'var(--accent)', color: 'white' }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--accent-hover)'}
                  onMouseLeave={(e) => e.target.style.background = 'var(--accent)'}
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Keyboard Shortcuts Overlay */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D0E12] border border-white/10 rounded-2xl p-6 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Keyboard Shortcuts</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowKeyboardHelp(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-white/60 mb-3 uppercase">Playback</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Play / Pause</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Stop</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">Esc</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Loop</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">⌘L</kbd>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white/60 mb-3 uppercase">Edit</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Undo</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">⌘Z</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Redo</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">⌘⇧Z</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Delete</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">Del</kbd>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white/60 mb-3 uppercase">Project</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Save</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">⌘S</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">New</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">⌘N</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Export</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">⌘E</kbd>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white/60 mb-3 uppercase">View</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Fullscreen</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">F</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Command Palette</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">⌘K</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Show Shortcuts</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">?</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Tabs 1-3</span>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-xs font-mono">1-3</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ShareModal
        project={{ id: currentProject?.id, name: projectName }}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />

      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onCommand={handleCommand}
      />

      <KeyboardShortcuts />
      <Confetti active={showConfetti} />

      {/* Project Browser Modal - NEW */}
      <ProjectBrowser
        open={showProjectBrowser}
        onOpenChange={setShowProjectBrowser}
        onLoadProject={handleLoadProject}
      />

      {/* Dialogs */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="bg-[#0D0E12] border-white/10">
          <DialogHeader>
            <DialogTitle>Start New Project?</DialogTitle>
          </DialogHeader>
          <p className="text-white/70">You have unsaved work. What would you like to do?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>Cancel</Button>
            <Button onClick={resetProject} className="bg-[#FF6B6B] hover:bg-[#E85D5D]">
              <X className="w-4 h-4 mr-2" />
              Discard
            </Button>
            <Button onClick={() => {
              setShowNewProjectDialog(false);
              setSaveProjectName(projectName);
              setShowSaveDialog(true);
            }} className="bg-[#16DB93] hover:bg-[#12B878] text-black">
              <Save className="w-4 h-4 mr-2" />
              Save First
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-[#0D0E12] border-white/10">
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
          </DialogHeader>
          <Input
            value={saveProjectName}
            onChange={(e) => setSaveProjectName(e.target.value)}
            placeholder="Project name..."
            autoFocus
            className="bg-white/5 border-white/10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveProject();
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProject} disabled={!saveProjectName.trim()} className="bg-[#16DB93] hover:bg-[#12B878] text-black">
              Save Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function StudioPage() {
  return (
    <UndoRedoProvider>
      <StudioContent />
    </UndoRedoProvider>
  );
}