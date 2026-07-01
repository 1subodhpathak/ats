import { useEffect, useMemo, useState } from "react";

import { scoreBands } from "./data";

const INITIAL_FEEDBACK = {
  tone: "neutral",
  title: "Loadout ready",
  message: "Place the right fields onto the resume and archive the filler.",
};

function shuffleList(items) {
  const next = [...items];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function getBand(score) {
  return [...scoreBands].reverse().find((band) => score >= band.min) ?? scoreBands[0];
}

function createRoundCards(profile) {
  return shuffleList(profile.cards.map((card) => card.id));
}

export function useResumeGame(profile) {
  const zoneMap = useMemo(
    () => Object.fromEntries(profile.zones.map((zone) => [zone.id, zone])),
    [profile]
  );

  const cardMap = useMemo(
    () => Object.fromEntries(profile.cards.map((card) => [card.id, card])),
    [profile]
  );

  const totalCorrectPlacements = profile.zones.length;

  const [placements, setPlacements] = useState({});
  const [discardedIds, setDiscardedIds] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [roundCardIds, setRoundCardIds] = useState(() => createRoundCards(profile));

  useEffect(() => {
    setPlacements({});
    setDiscardedIds([]);
    setSelectedCardId(null);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setFeedback({
      tone: "neutral",
      title: `${profile.label} loaded`,
      message: profile.headerGuide,
    });
    setRoundCardIds(createRoundCards(profile));
  }, [profile]);

  const placedCardIds = Object.values(placements);

  const availableCards = useMemo(
    () =>
      roundCardIds
        .map((id) => cardMap[id])
        .filter((card) => card && !placedCardIds.includes(card.id) && !discardedIds.includes(card.id)),
    [cardMap, discardedIds, placedCardIds, roundCardIds]
  );

  const completedCount = Object.keys(placements).length;
  const progress = Math.round((completedCount / totalCorrectPlacements) * 100);
  const completed = completedCount === totalCorrectPlacements;
  const rank = getBand(score);

  function updateFeedback(nextFeedback) {
    setFeedback(nextFeedback);
  }

  function emitCorrectPlacement(card, zoneId) {
    const nextStreak = streak + 1;
    const gainedPoints = 80 + card.difficulty * 22 + nextStreak * 12;

    setPlacements((current) => ({ ...current, [zoneId]: card.id }));
    setSelectedCardId(null);
    setAttempts((current) => current + 1);
    setStreak(nextStreak);
    setScore((current) => current + gainedPoints);
    updateFeedback({
      tone: "success",
      title: `${zoneMap[zoneId].title} synced`,
      message: `+${gainedPoints}`,
    });

    return { event: "correct", points: gainedPoints };
  }

  function emitWrongPlacement(card, zoneId) {
    const penalty = 20 + card.difficulty * 5;

    setAttempts((current) => current + 1);
    setStreak(0);
    setScore((current) => Math.max(0, current - penalty));
    updateFeedback({
      tone: "error",
      title: `${zoneMap[zoneId].title} mismatch`,
      message: card.correctZoneId ? `Try ${zoneMap[card.correctZoneId].title}` : "Archive that one",
    });

    return { event: "wrong", points: -penalty };
  }

  function placeCard(cardId, zoneId) {
    const card = cardMap[cardId];

    if (!card || placements[zoneId]) {
      return null;
    }

    if (card.correctZoneId === zoneId) {
      return emitCorrectPlacement(card, zoneId);
    }

    return emitWrongPlacement(card, zoneId);
  }

  function discardCard(cardId) {
    const card = cardMap[cardId];

    if (!card || discardedIds.includes(cardId) || placedCardIds.includes(cardId)) {
      return null;
    }

    setAttempts((current) => current + 1);
    setSelectedCardId(null);

    if (!card.correctZoneId) {
      const gainedPoints = 42 + card.difficulty * 10;

      setDiscardedIds((current) => [...current, cardId]);
      setStreak((current) => current + 1);
      setScore((current) => current + gainedPoints);
      updateFeedback({
        tone: "success",
        title: "Noise purged",
        message: `+${gainedPoints}`,
      });

      return { event: "discard-correct", points: gainedPoints };
    }

    const penalty = 26;
    setStreak(0);
    setScore((current) => Math.max(0, current - penalty));
    updateFeedback({
      tone: "error",
      title: "Keep that signal",
      message: "That field belongs on the resume.",
    });

    return { event: "discard-wrong", points: -penalty };
  }

  function returnCardToTray(zoneId) {
    const existingCardId = placements[zoneId];

    if (!existingCardId) {
      return null;
    }

    setPlacements((current) => {
      const next = { ...current };
      delete next[zoneId];
      return next;
    });
    setSelectedCardId(existingCardId);
    setStreak(0);
    updateFeedback({
      tone: "neutral",
      title: `${zoneMap[zoneId].title} reopened`,
      message: "Field returned to tray",
    });

    return { event: "return", cardId: existingCardId };
  }

  function resetGame() {
    setPlacements({});
    setDiscardedIds([]);
    setSelectedCardId(null);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setFeedback(INITIAL_FEEDBACK);
    setRoundCardIds(createRoundCards(profile));
  }

  return {
    availableCards,
    cardMap,
    completed,
    completedCount,
    feedback,
    placeCard,
    placements,
    progress,
    rank,
    resetGame,
    returnCardToTray,
    score,
    selectedCardId,
    setSelectedCardId,
    streak,
    attempts,
    discardCard,
    totalCorrectPlacements,
    zoneMap,
  };
}
