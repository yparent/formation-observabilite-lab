# Runbook — ShopHighErrorRate

**Symptôme** : plus de 5 % des requêtes de la boutique renvoient une erreur 5xx depuis 2 minutes.

**Impact** : les clients ne peuvent plus commander. Chaque minute coûte du chiffre d'affaires.

## Diagnostic (5 minutes)

1. Ouvrir le dashboard *TP 5 - Boutique en ligne* et regarder le panneau *Taux d'erreur*.
   Une seule instance touchée ou les deux ?
2. Dans Prometheus : `sum by (instance, route) (rate(http_requests_total{status=~"5.."}[5m]))`.
   Quelle route est en cause ? Si c'est uniquement `/api/checkout`, suspecter le prestataire de paiement.
3. Vérifier les dépendances : `redis_up`, `probe_success`.
4. Regarder les logs : `docker compose logs --tail 100 shop-api-1`.

## Remédiation

- Erreurs sur toutes les routes → redémarrer l'instance fautive : `docker compose restart shop-api-1`.
- Pendant la formation, c'est probablement le mode chaos : `./lab.sh chaos errors off`.

## Après l'incident

Compléter le post-mortem : cause racine, durée, détection (l'alerte a-t-elle sonné assez tôt ?).
