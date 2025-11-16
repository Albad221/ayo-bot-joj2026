#!/bin/bash
# Script pour chatter avec Ayo via le terminal

echo "🦁 ================================ 🦁"
echo "   Chat Terminal avec Ayo"
echo "   JOJ Dakar 2026"
echo "🦁 ================================ 🦁"
echo ""

SESSION_ID="terminal_$(date +%s)"

while true; do
    echo -n "Vous: "
    read USER_MESSAGE

    if [ "$USER_MESSAGE" = "exit" ] || [ "$USER_MESSAGE" = "quit" ]; then
        echo "Au revoir! Grandir ensemble! 🦁"
        break
    fi

    if [ -z "$USER_MESSAGE" ]; then
        continue
    fi

    echo ""
    echo "🦁 Ayo réfléchit..."
    echo ""

    RESPONSE=$(curl -s -X POST http://127.0.0.1:3002/api/chat \
        -H "Content-Type: application/json" \
        -d "{\"message\": \"$USER_MESSAGE\", \"sessionId\": \"$SESSION_ID\"}" \
        | python3 -c "import sys, json; r=json.load(sys.stdin); print(r.get('response', 'Erreur de connexion'))")

    echo "Ayo: $RESPONSE"
    echo ""
    echo "---"
    echo ""
done
