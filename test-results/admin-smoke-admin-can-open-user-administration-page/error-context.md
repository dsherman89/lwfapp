# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - heading "Admin Dashboard" [level=1] [ref=e4]
      - generic [ref=e5]:
        - link "User administration Create, edit, or delete users" [ref=e6] [cursor=pointer]:
          - /url: /admin/users
          - generic [ref=e7]: User administration
          - generic [ref=e8]: Create, edit, or delete users
        - link "Events Create, edit, or delete events" [ref=e9] [cursor=pointer]:
          - /url: /admin/events
          - generic [ref=e10]: Events
          - generic [ref=e11]: Create, edit, or delete events
        - link "Matches Create, edit, or delete matches" [ref=e12] [cursor=pointer]:
          - /url: /admin/matches
          - generic [ref=e13]: Matches
          - generic [ref=e14]: Create, edit, or delete matches
        - generic [ref=e15]:
          - generic [ref=e16]: Coming soon
          - generic [ref=e17]: More admin tools will appear here.
  - button "Open Next.js Dev Tools" [ref=e23] [cursor=pointer]:
    - img [ref=e24]
  - alert [ref=e27]
```